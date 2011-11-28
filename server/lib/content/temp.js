var fs = require("fs");

module.exports = {
  opts: {},

  file: function(filePath, rev, callback) {
    callback = (rev && typeof rev === "function") ? rev : callback;

    var opts = this.opts;
    var path = opts.path + filePath;

    fs.readFile(path, function(err, buffer) {
      callback(buffer.toString());
    });
  },

  use: function(path) {
    this.opts.path = path;
  }
};
