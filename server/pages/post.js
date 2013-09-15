var fs = require("fs");
var path = require("path");
var moment = require("moment");
var util = require("../lib/util");

var posts = require("../lib/posts");
var content = require("../content");

function recent_post(req, res) {
  util.getLayout("index", function(err, tmpl) {
    if (err) { return res.send(500); }

    fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
      tmpl.filters.add("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      try {
        var post = posts.get(req.params.id).toJSON();

        content.assemble(post.path, function(html, revs) {
          tmpl.partials.add("content", buf.toString(), {
            post: post,
            revs: revs,
            content: html,
            url: req.url
          });

          tmpl.filters.add("slice", function(val, count) {
            return val.slice(0, count);
          });

          res.send(tmpl.render({
            title: post.title + " | Tim Branyen @tbranyen",
            post_active: "active"
          }));
        });
      } catch(ex) {
        res.send(404);
      }
    });
  });
}

function specific_post(req, res) {
  util.getLayout("index", function(err, tmpl) {
    if (err) { return res.send(500); }

    fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
      tmpl.filters.add("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      try {
        var post = posts.get(req.params.id).toJSON();

        content.assemble(post.path, req.params.rev, function(html, revs) {
          tmpl.partials.add("content", buf.toString(), {
            post: post,
            revs: revs,
            content: html,
            url: req.url
          });

          tmpl.filters.add("slice", function(val, count) {
            return val.slice(0, count);
          });

          res.send(tmpl.render({
            title: post.title + " | Tim Branyen @tbranyen",
            post_active: "active"
          }));
        });
      } catch(ex) {
        res.send(404);
      }
    });
  });
}

function post_assets(req, res) {
  var post = "/../content/posts/" + posts.get(req.params.id).toJSON().path;

  // The actual asset path
  var assetPath = req.params[0];

  // Craft the absolute path.
  var absolutePath = __dirname + "/../" + post + "assets/" + assetPath;

  // Ensure someone isn't trying to get access to a file outside this server.
  if (path.relative(assetPath, __dirname) === "../server/pages") {
    return fs.createReadStream(absolutePath).pipe(res);
  }

  // Whatever, hackers.
  res.send(420);
}

exports.attachTo = function(site) {
  site.get("/post/:id", recent_post);
  site.get("/post/:id/:rev", specific_post);
  site.get("/post/:id/assets/*", post_assets);
};
