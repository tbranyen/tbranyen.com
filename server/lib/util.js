var fs = require("fs");
var path = require("path");
var combyne = require("combyne");

exports.getLayout = function(name, callback) {
  var realPath = path.resolve("templates/layouts/" + name + ".html");

  fs.readFile(realPath, function(err, buffer) {
    if (err) { return callback(err); }

    callback(null, combyne(buffer.toString()));
  });
};