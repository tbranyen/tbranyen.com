const promisify = require("promisify-node");
const fs = promisify("fs");
const Backbone = require("backbone");
const RSS = require("rss");
const consumare = promisify("consumare", require);
const Q = require("q");
const Post = require("./models/post");

var basePath = __dirname + "/../../";
var config = require(basePath + "package.json").site;

// Locate the configuration and set the engine.
consumare.configure(basePath, config);

// Posts collection.
var Posts = Backbone.Collection.extend({
  model: Post,

  comparator: function(post) {
    return -1 * new Date(post.get("posted"));
  },

  sync: function(method, model, options) {
    return fs.readdir("content/posts/").then(function(folders) {
      var promises = folders.map(function(folder) {
        var path = "posts/" + folder + "/post.md";

        return consumare.meta(path).then(function(meta) {
          meta.metadata.path = folder + "/";

          return meta.metadata;
        });
      });

      return Q.all(promises).then(options.success);
    });
  },

  rss: function() {
    return this.feed.xml();
  },

  initialize: function() {
    this.feed = new RSS({
      title: "Tim Branyen @tbranyen",
      description: "JavaScript and web technology updates.",
      feed_url: "http://tbranyen.com/rss.xml",
      site_url: "http://tbranyen.com",
      image_url: "",
      author: "Tim Branyen @tbranyen"
    });
  }
});

var posts = new Posts();

// When posts are updated add to the feed
posts.on("sync", function() {
  // Add each post into the rss feed
  posts.each(function(post) {
    posts.feed.item({
      title: post.get("title"),
      description: post.get("title"),
      date: post.get("posted"),
      url: "http://tbranyen.com/post/" + post.id
    });
  });
});

// TODO FileSystem Updates.

// Expose the posts.
module.exports = posts;
