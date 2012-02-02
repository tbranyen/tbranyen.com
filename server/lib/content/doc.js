var fs = require("fs");
var path = require("path");
var combyne = require("combyne");
var storage = require("./temp");
var hl = require("highlight.js");
var marked = require("marked");

storage.use("../site-content/posts/", "master");

var doc = {
  // Parse out a post or any bit of content that has meta data.
  parse: function(contents) {
    var i, len, parts, key, val;
    var obj = { metadata: {}, contents: "" };
    var docs = contents.split("\n\n");
    var lines = docs[0].split("\n");

    for (i = 0, len = lines.length; i < len; i++) {
      parts = lines[i].trim().split(":");

      if (parts.length < 2) {
        throw new Error("Invalid key: val");
      }

      key = parts[0];
      val = parts.slice(1).join(":");

      obj.metadata[key] = eval("(" + val + ")");
    }

    obj.contents = docs.slice(1).join("\n\n");

    return obj;
  },

  meta: function(path, callback) {
    // Read in the file path
    storage.file(path + "post.md", "head", function(contents) {
      var parts = doc.parse(contents);

      callback(parts);
    });
  },

  // Take a content file path and render out the content
  assemble: function(filepath, callback) {
    // Read in the file path
    storage.file(filepath + "post.md", "head", function(post) {
      var contents = post;
      var parts = doc.parse(contents);
      var tmpl = combyne(parts.contents, parts.metadata);
      var extmap = {
        ".js": "javascript",
        ".php": "php",
        ".lua": "lua"
      };

      // Convert scripts to GitHub flavored markdown
      tmpl.filters.add("render", function(val) {
        var type = val.split(".").pop();
        var codeBlock = "<pre><code>";
        var lol = fs.readFileSync("../site-content/posts/" + filepath + "assets/" + val).toString();
        var ext = path.extname(val);


        codeBlock += hl.highlight(extmap[ext] || "text", lol).value;
        codeBlock += "</code></pre>";

        return codeBlock;
      });

      callback(marked(tmpl.render()));

      // Convert the markdown to HTML
      //markdown.toHtml(tmpl.render(), function(html) {
      //  var html = html.toString();
      //  callback(html);
      //});
    });
  }
};

exports.doc = doc;
