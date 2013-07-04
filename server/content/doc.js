var fs = require("fs");
var path = require("path");
var combyne = require("combyne");
var storage = require("./storage");
var hl = require("highlight.js");
var marked = require("marked");
var basePath = __dirname + "/../../";
var config = require(basePath + "package.json");

// Configure the storage driver.
storage.use(basePath + config.content.repo, config.content.branch);

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

  meta: function(filePath, callback) {
    // Read in the file path
    storage.file("posts/" + filePath + "post.md", "head", function(contents) {
      var parts = doc.parse(contents);

      callback(parts);
    });
  },

  // Take a content file path and render out the content
  assemble: function(filepath, callback) {
    // Read in the file path
    storage.file("posts/" + filepath + "post.md", "head", function(post) {
      var contents = post;
      var parts = doc.parse(contents);
      var tmpl = combyne(parts.contents, parts.metadata);
      var extmap = {
        ".js": "javascript",
        ".php": "php",
        ".lua": "lua",
        ".xml": "xml",
        ".coffee": "coffeescript",
        ".yaml": "coffeescript"
      };

      // Convert scripts to GitHub flavored markdown
      tmpl.filters.add("render", function(val) {
        var type = val.split(".").pop();
        var codeBlock = "<pre><code>";
        var lol = fs.readFileSync(basePath + "content/posts/" + filepath +
          "assets/" + val).toString();
        var ext = path.extname(val);

        try {
          codeBlock += hl.highlight(extmap[ext] || "text", lol).value;
          codeBlock += "</code></pre>";
        } catch (ex) {
          console.log(val + " was unable to be highlighted");
        }

        return codeBlock;
      });

      callback(marked(tmpl.render()));
    });
  }
};

exports.doc = doc;