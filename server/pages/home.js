const moment = require("moment");
const createPage = require("../util/createPage");
const posts = require("../lib/posts");

function home(req, res) {
  createPage("index", "home").spread(function(pageLayout, home) {
    pageLayout.registerFilter("formatDate", function(date) {
      return moment(date).format("dddd, MMM D, YYYY");
    });

    pageLayout.registerPartial("content", String(home), {
      posts: posts.toJSON()
    });

    res.send(pageLayout.render({
      title: "Tim Branyen @tbranyen",
      posts_active: "active",
      node_env: process.env.NODE_ENV
    }));
  });
}

module.exports = function(site) {
  site.get("/", home);
};
