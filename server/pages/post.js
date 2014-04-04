const fs = require("fs");
const path = require("path");
const moment = require("moment");
const util = require("../lib/util");
const posts = require("../lib/posts");
const consumare = require("consumare");

function show_post(req, res) {
  util.getLayout("index", function(err, tmpl) {
    if (err) { return res.send(500); }

    fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
      tmpl.registerFilter("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      try {
        var post = posts.get(req.params.id).toJSON();
        var sha = req.params.rev;

        consumare.assemble(post.path, sha, function(html, revs) {
          var max = 0;

          tmpl.registerPartial("content", buf.toString(), {
            post: post,
            revs: revs.map(function(rev) {
              var added = rev.stats.added;
              var deleted = rev.stats.deleted;
              var modified = rev.stats.modified;

              // Find the largest number to set as base.
              max = Math.max(max, added, deleted, modified);

              rev.stats.added = (added / max) * 100;
              rev.stats.deleted = (deleted / max) * 100;
              rev.stats.modified = (modified / max) * 100;

              // Construct a usable post url.
              rev.url = "/post/" + post.slug + "/" + rev.sha;

              return rev;
            }).reverse(),
            content: html,
            url: req.url,
            node_env: process.env.NODE_ENV
          });

          tmpl.registerFilter("slice", function(val, count) {
            return val.slice(0, count);
          });

          res.send(tmpl.render({
            title: post.title + " | Tim Branyen @tbranyen",
            posts_active: "active",
            node_env: process.env.NODE_ENV
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

module.exports = function(site) {
  site.get("/post/:id", show_post);
  site.get("/post/:id/:rev", show_post);
  site.get("/post/:id/assets/*", post_assets);
};
