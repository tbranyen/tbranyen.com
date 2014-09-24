const fs = require("fs");
const path = require("path");
const posts = require("../collections/posts");
const consumare = require("consumare");
const pkg = require("../../package.json");

// Alias the site configuration.
var config = pkg.site;

/**
 * Renders the `/post/*` pages.
 *
 * @param {Object} req - An Express Request object.
 * @param {Object} res - An Express Response object.
 */
function showPost(req, res) {
  var post = posts.get(req.params.id);

  if (!post) {
    return res.status(404);
  }

  var sha = req.params.rev;
  var postPath = "posts/" + post.get("path") + "post.md";

  // Fetch the associated post content from the Git content repository.  This
  // will return the content and any revisions.
  consumare.assemble(postPath, sha, function(html, revs) {
    var max = 0;

    res.render("post", {
      // Attach data to the post template to be rendered.
      post: post.toJSON(),
      content: html,
      url: req.url,
      node_env: process.env.NODE_ENV,

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
        rev.url = "/post/" + post.get("slug") + "/" + rev.sha;

        return rev;
      }).reverse(),

      title: post.get("title") + config.title,
      posts_active: "active",
      node_env: process.env.NODE_ENV
    });
  });
}

/**
 * Renders referenced post assets.
 *
 * @param {Object} req - An Express Request object.
 * @param {Object} res - An Express Response object.
 */
function postAssets(req, res) {
  // FIXME Untangle this.
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
  res.status(420);
}

/**
 * Bind routes.
 *
 * @param {Object} site - The Express application.
 */
module.exports = function(site) {
  site.get("/post/:id", showPost);
  site.get("/post/:id/:rev", showPost);
  site.get("/post/:id/assets/*", postAssets);
};
