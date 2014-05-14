const createPage = require("../util/createPage");

function talks(req, res) {
  createPage("layouts/index", "talks").spread(function(page, talks) {
    page.registerPartial("content", talks);

    res.send(page.render({
      title: "Talks | Tim Branyen @tbranyen",
      talks_active: "active",
      node_env: process.env.NODE_ENV
    }));
  });
}

module.exports = function(site) {
  site.get("/talks", talks);
};
