const fs = require("fs");
const util = require("../lib/util");

function talks(req, res) {
  util.getLayout("index", function(err, tmpl) {
    fs.readFile("./templates/talks.html", function(err, buf) {
      tmpl.partials.add("content", buf.toString(), {});

      res.send(tmpl.render({
        title: "Projects | Tim Branyen @tbranyen",
        talks_active: "active",
        node_env: process.env.NODE_ENV
      }));
    });
  });
}

exports.attachTo = function(site) {
  site.get("/talks", talks);
};
