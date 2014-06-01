var extmap = {
  ".js": "javascript",
  ".php": "php",
  ".lua": "lua",
  ".xml": "xml",
  ".coffee": "coffeescript",
  ".yaml": "coffeescript"
};

// Convert scripts to GitHub flavored markdown
module.exports = function(val) {
  var type = val.split(".").pop();
  var codeBlock = "<pre><code>";
  var post = consumare.config.content.repo + path.dirname(filePath);
  var source = String(fs.readFileSync(post + "/assets/" + val));
  var ext = path.extname(val);

  try {
    codeBlock += hl.highlight(extmap[ext] || "text", source).value;
    codeBlock += "</code></pre>";
  }
  catch (ex) {
    console.warn(val + " was unable to be highlighted");
  }

  return codeBlock;
};
