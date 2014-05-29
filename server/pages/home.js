const posts = require("../lib/collections/posts");
const pkg = require("../../package.json");

// Alias the site configuration.
var config = pkg.site;

// Immediately fetch all posts.
posts.fetch();

/**
 * Renders the `/` page.
 *
 * @param {Object} req - An Express Request object.
 * @param {Object} res - An Express Response object.
 */
function home(req, res) {
  res.render("home", {
    posts: posts.toJSON(),
    title: config.title,
    posts_active: "active",
    node_env: process.env.NODE_ENV
  });
}

/**
 * Bind routes.
 *
 * @param {Object} site - The Express application.
 */
module.exports = function(site) {
  site.get("/", home);
};
