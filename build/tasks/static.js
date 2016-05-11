var request = require("request");
var cheerio = require("cheerio");
var grunt = require("grunt");

var seen = [];

request = request.defaults({ encoding: null });

function parsePage(url, path, options, callback) {
  console.log("Processing", "http://" + url + path);

  return new Promise(function(resolve, reject) {
    request("http://" + url + path, function(err, resp, body) {
      if (err) {
        err.url = "http://" + url + path;
        console.log('Failed to fetch %s', err.url);
        return reject(err);
      }

      var root = resp.request.path !== "/" ? resp.request.path : "/index";
      var $ = cheerio.load(body.toString());

      var page = {
        href: root + ".html"
      };

      // Save all assets.
      var assetPromises = $("img[src], script[src]").map(function() {
        var asset = {
          href: $(this).attr("src")
        };

        options.pages.push(asset);

        // Fetch the image and save the contents.
        return new Promise(function(resolve, reject) {
          request("http://" + url + asset.href, function(err, resp, body) {
            if (err) { return reject(err); }
            asset.html = body;
            resolve(body);
          });
        });
      }).get();

      // Iterate over every page here.
      var anchors = $("a");

      // Remove all external pages and initial page.
      var anchorPromises = anchors.filter(function() {
        var href = this.attribs.href;
        return href.indexOf("/") === 0 && href !== path;
      }).map(function() {
        var href = $(this).attr("href");

        // Update the document.
        $(this).attr("href", (href === "/" ? href + "index" : href) + ".html");

        // Don't re-process the same urls.
        if (seen.indexOf(href) === -1) {
          seen.push(href);
          return parsePage(url, href, options, callback);
        }
      }).get();

      // Add the correct contents.
      page.html = $.html();

      // Add to all pages.
      options.pages.push(page);

      Promise.all([].concat(assetPromises, anchorPromises)).then(
        resolve,
        reject
      );
    });
  });
}

module.exports = function(grunt) {
  grunt.registerTask("static", function() {
    var done = this.async();

    var options = this.options({
      host: "localhost",
      port: 1987,
      path: "/",
      out: "dist"
    });

    // Place to store pages.
    options.pages = [];

    var url = options.host + ":" + options.port;
    var retry = 1;

    function success() {
      options.pages.forEach(function(page) {
        grunt.file.write(options.out + page.href, page.html, {
          encoding: null
        });
      });

      done();
    }

    // Start crawling the site.
    parsePage(url, options.path, options).then(success).catch(function(err) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          parsePage(url, options.path, options).then(success, reject);
        }, 500);
      });
    }).then(done, done);;
  });
};
