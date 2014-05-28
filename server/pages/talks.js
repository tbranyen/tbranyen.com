const pkg = require("../../package.json");

// Alias the site configuration.
var config = pkg.site;

/**
 * Renders the `/talks` page.
 *
 * @param {Object} req - An Express Request object.
 * @param {Object} res - An Express Response object.
 */
function talks(req, res) {
  res.render("talks", {
    title: "Talks | Tim Branyen @tbranyen",
    projects_active: "active",
    node_env: process.env.NODE_ENV
  });
}

/**
 * Bind routes.
 *
 * @param {Object} site - The Express application.
 */
module.exports = function(site) {
  site.get("/talks", talks);
};
