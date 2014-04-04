const fs = require("fs");
const util = require("../lib/util");

function projects(req, res) {
  util.getLayout("index", function(err, tmpl) {
    if (err) { return res.send(500); }

    fs.readFile("templates/projects.html", function(err, buf) {
      tmpl.registerPartial("content", buf.toString(), {
        //mine: mine.toJSON(),
        //forks: forks.toJSON()
      });

      res.send(tmpl.render({
        title: "Projects | Tim Branyen @tbranyen",
        projects_active: "active",
        node_env: process.env.NODE_ENV
      }));
    });
  });
}

module.exports = function(site) {
  site.get("/projects", projects);
};
