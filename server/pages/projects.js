const fs = require("fs");
const util = require("../lib/util");

exports.attachTo = function(site) {
  site.get("/projects", function(req, res) {
    try {
      util.getLayout("index", function(err, tmpl) {
        if (err) { return res.send(500); }

        fs.readFile("templates/projects.html", function(err, buf) {
          tmpl.partials.add("content", buf.toString(), {
            mine: mine.toJSON(),
            forks: forks.toJSON()
          });

          res.send(tmpl.render({
            title: "Projects | Tim Branyen @tbranyen",
            projects_active: "active",
            node_env: process.env.NODE_ENV
          }));
        });
      });
    } catch(ex) {
      res.send("internal error");
    }
  });
};
