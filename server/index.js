// Allow the master to facilitate the spawning of child processes.
if (process.env.NODE_ENV === "production" && require("cluster").isMaster) {
  return require("./lib/master").startup();
}

const path = require("path");
const fs = require("fs");
const express = require("express");
const combyne = require("combyne");
const request = require("request");
const moment = require("moment");
const RSS = require("rss");
const i18n = require("i18n");
const posts = require("./lib/posts").posts;

var site = express();

// Serve static files.
["dist", "themes", "bower_components"].forEach(function(name) {
  site.use("/" + name, express.static(path.resolve(name)));
});

// Automatically attach all pages that have been defined in the `pages`
// directory.
var paths = fs.readdirSync(__dirname + "/pages/").filter(function(path) {
  return path[0] !== ".";
});

// Require all pages.
paths.forEach(function(path) {
  try {
    require("./pages/" + path.slice(0, -3))(site);
  }
  catch (ex) {
    console.error("Unable to load", path, ex);
  }
});

// Serve RSS.
site.get("/rss.xml", function(req, res) {
  res.writeHead(200, { "Content-Type": "application/rss+xml" });
  res.end(posts.rss());
});

// Listen server on the given port and host.
site.listen(process.env.PORT || 1987, process.env.HOST || "127.0.0.1");
