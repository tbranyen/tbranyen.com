var extmap = {
  ".js": "javascript",
  ".php": "php",
  ".lua": "lua",
  ".xml": "xml",
  ".coffee": "coffeescript",
  ".yaml": "coffeescript"
};

// Convert scripts to GitHub flavored markdown
module.exports = function(val, lang) {
  var type = val.split(".").pop();
  var codeBlock = "<pre><code>";
  var post = consumare.config.content.repo + path.dirname(filePath);
  var source = String(fs.readFileSync(post + "/assets/" + val));
  var ext = path.extname(val);

  try {
    var LANG = lang || extmap[ext] || "text";
    codeBlock += hl.highlight(LANG, source).value;
    codeBlock += "</code></pre>";
  }
  catch (ex) {
    console.warn(val + " was unable to be highlighted");
  }

  return codeBlock;
};
