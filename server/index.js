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
const content = require("./content");
const projects = require("./lib/projects").allForUser("tbranyen");
const posts = require("./lib/posts").posts;

var site = express();

// Serve static styles.
site.use("/dist", express.static(path.resolve("dist")));
site.use("/styles", express.static(path.resolve("styles")));

// Automatically attach all pages that have been defined in the `pages`
// directory.
fs.readdirSync(__dirname + "/pages/").filter(function(path) {
  return path[0] !== ".";
}).forEach(function(path) {
  try {
    require("./pages/" + path.slice(0, -3)).attachTo(site);
  } catch (ex) {
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
