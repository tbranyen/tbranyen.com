// Core.
var fs = require("fs");
var path = require("path");

// Third-party.
var combyne = require("combyne");
var express = require("express");
var request = require("request");
var moment = require("moment");
var RSS = require("rss");

// Internal.
var control = require("./lib/control");
var content = require("./content");

// Get all my projects and all projects I've forked from GitHub.
var projects = require("./lib/projects").allForUser("tbranyen");
var posts = require("./lib/posts").posts;

// Create the site server.
var site = express();

// Serve static styles.
site.use("/dist", express.static(path.resolve("dist")));
site.use("/styles", express.static(path.resolve("styles")));

// Attach pages.
require("./pages/resume").attachTo(site);
require("./pages/projects").attachTo(site);
require("./pages/home").attachTo(site);

// Serve RSS.
site.get("/rss.xml", function(req, res) {
  res.writeHead(200, { "Content-Type": "application/rss+xml" });
  res.end(posts.rss());
});

// Allow control to handle process driven events and respond to them.
control.attachTo(process);

// By default listen locally on port 8000.
site.listen(8000, "127.0.0.1");
