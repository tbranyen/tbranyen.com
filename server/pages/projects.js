const createPage = require("../util/createPage");

function projects(req, res) {
  createPage("layouts/index", "projects").spread(function(page, projects) {
    page.registerPartial("content", projects, {
      //mine: mine.toJSON(),
      //forks: forks.toJSON()
    });

    res.send(page.render({
      title: "Projects | Tim Branyen @tbranyen",
      projects_active: "active",
      node_env: process.env.NODE_ENV
    }));
  });
}

module.exports = function(site) {
  site.get("/projects", projects);
};
