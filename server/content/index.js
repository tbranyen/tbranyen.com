const fs = require("fs");
const path = require("path");
const combyne = require("combyne");
const storage = require("./storage");
const hl = require("highlight.js");
const marked = require("marked");
const basePath = __dirname + "/../../";
const config = require(basePath + "config.json");

// Configure the storage driver.
storage.use(basePath + config.content.repo, config.content.branch);

var document = {
  // Parse out a post or any bit of content that has meta data.
  parse: function(contents, revs) {
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
    // Read in the file path.
    var fileLookup = storage.file("posts/" + filePath + "post.md");
    
    // Once completed, return the parsed document contents.
    fileLookup.then(function(contents) {
      callback(document.parse.apply(document, contents));
    });
  },

  // Take a content file path and render out the content
  assemble: function(filepath, rev, callback) {
    // Allow argument shifting.
    if (typeof rev === "function") {
      callback = rev;
      rev = undefined;
    }

    // Read in the file path.
    var fileLookup = storage.file("posts/" + filepath + "post.md", rev);
    
    // Once read in, apply syntax highlighting and render out the template.
    fileLookup.then(function(result) {
      var contents = result[0];
      var revs = result[1];
      var parts = document.parse(contents);
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
        var source = fs.readFileSync(basePath + "content/posts/" + filepath +
          "assets/" + val).toString();
        var ext = path.extname(val);

        try {
          codeBlock += hl.highlight(extmap[ext] || "text", source).value;
          codeBlock += "</code></pre>";
        } catch (ex) {
          console.warn(val + " was unable to be highlighted");
        }

        return codeBlock;
      });

      callback(marked(tmpl.render()), revs);
    });
  }
};

module.exports = document;
