var request = require("request");
var cheerio = require("cheerio");
var grunt = require("grunt");

var seen = [];

request = request.defaults({ encoding: null });

function parsePage(url, path, options, callback) {
  console.log("Processing", "http://" + url + path);

  request("http://" + url + path, function(err, resp, body) {
    if (err) {
      console.error(err, resp);
      return;
    }

    var root = resp.request.path !== "/" ? resp.request.path : "/index";

    var $ = cheerio.load(body.toString());

    var page = {
      href: root + ".html"
    };

    // Save all images.
    var images = $("img[src]");

    images.each(function() {
      var img = {
        href: $(this).attr("src")
      };

      options.counter += 1;

      // Fetch the image and save the contents.
      request("http://" + url + img.href, function(err, resp, body) {
        options.counter -= 1;
        img.html = body;
      });

      options.pages.push(img);
    });

    // Save all scripts.
    var scripts = $("script[src]");

    scripts.each(function() {
      var script = {
        src: $(this).attr("src")
      };

      options.counter += 1;

      // Fetch the image and save the contents.
      request("http://" + url + script.href, function(err, resp, body) {
        options.counter -= 1;
        script.html = body;
      });

      options.pages.push(script);
    });

    // Iterate over every page here.
    var anchors = $("a");

    // Remove all external pages and initial page.
    anchors.filter(function() {
      var href = this.attribs.href;
      return href.indexOf("/") === 0 && href !== path;
    }).each(function() {
      var href = $(this).attr("href");

      // Update the document.
      $(this).attr("href", (href === "/" ? href + "index" : href) + ".html");

      // Don't re-process the same urls.
      if (seen.indexOf(href) === -1) {
        parsePage(url, href, options, callback);
        seen.push(href);

        // Increment every new request.
        options.counter += 1;
      }
    });

    // Add the correct contents.
    page.html = $.html();

    // Add to all pages.
    options.pages.push(page);

    // Decrement this completed request.
    options.counter -= 1;

    // Once all callbacks have completed, trigger main callback.
    if (!options.counter) {
      callback();
    }
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

    // Start the counter at 1 for the initial request.
    options.counter = 0;

    // Place to store pages.
    options.pages = [];

    // Start crawling the site.
    parsePage(options.host + ":" + options.port, options.path, options, function() {
      options.pages.forEach(function(page) {
        grunt.file.write(options.out + page.href, page.html, {
          encoding: null
        });
      });
      done();
    });
  });
};
