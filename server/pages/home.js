const createPage = require("../util/createPage");
const posts = require("../lib/posts");

// Immediately fetch all posts.
posts.fetch();

function home(req, res) {
  createPage("layouts/index", "home").spread(function(page, home) {
    // Add the posts to the partial.
    home.data.posts = posts.toJSON()

    // Add the partial.
    page.registerPartial("content", home);

    // Render the page.
    res.send(page.render({
      title: "Tim Branyen @tbranyen",
      posts_active: "active",
      node_env: process.env.NODE_ENV
    }));
  });
}

module.exports = function(site) {
  site.get("/", home);
};
