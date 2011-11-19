var fs = require('fs');
var combyne = require('combyne');
var storage = require('./storage');

storage.use('../site-content/.git', 'master');

var doc = {
  // Parse out a post or any bit of content that has meta data.
  parse: function(contents) {
    var i, len, parts, key, val;
    var obj = { metadata: {}, contents: '' };
    var docs = contents.split('\n\n');
    var lines = docs[0].split('\n');

    for (i = 0, len = lines.length; i < len; i++) {
      parts = lines[i].trim().split(':');

      if (parts.length < 2) {
        throw new Error('Invalid key: val');
      }

      key = parts[0];
      val = parts.slice(1).join(':');

      obj.metadata[key] = eval('(' + val + ')');
    }

    obj.contents = docs.slice(1).join('\n\n');

    return obj;
  },

  // Take a content file path and render out the content
  assemble: function(path, callback) {
    // Read in the file path
    storage.file(path + 'post.md', 'head', function(post) {
      var contents = post.content;
      var parts = doc.parse(contents);
      var tmpl = combyne(parts.contents, parts.metadata);

      // Convert scripts to GitHub flavored markdown
      tmpl.filters.add('render', function(val) {
        var type = val.split('.').pop();
        var codeBlock = '``` ' + type + '\n';
        codeBlock += fs.readFileSync('../site-content/' + path + 'assets/' + val).toString() + '\n';
        codeBlock += '```';
        
        return codeBlock + '\n';
      });

      callback(tmpl.render());

      // Convert the markdown to HTML
      //markdown.toHtml(tmpl.render(), function(html) {
      //  callback(html.toString());
      //});
    });
  }
};

exports.doc = doc;
