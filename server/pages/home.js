var fs = require("fs");
var path = require("path");
var util = require("../lib/util");

var posts = require("../lib/posts");
var content = require("../content");

function home(req, res) {
  util.getLayout("index", function(err, tmpl) {
    if (err) {
      return res.send(500);
    }

    var realPath = path.resolve("templates/home.html");

    fs.readFile(realPath, function(err, buf) {
      tmpl.filters.add("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      tmpl.partials.add("content", buf.toString(), {
        posts: posts.toJSON()
      });

      res.send(tmpl.render({
        title: "Tim Branyen @tbranyen",
        post_active: "active"
      }));
    });
  });
}

exports.attachTo = function(site) {
  site.get("/", home);
  site.get("*", home);
};
