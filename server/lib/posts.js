const fs = require("fs");
const Backbone = require("backbone");
const RSS = require("rss");
const content = require("../content");

var basePath = __dirname + "/../../";
var config = require(basePath + "config.json");

// Locate the configuration and set the engine.
content.configure(basePath, config);

var Post = Backbone.Model.extend({
  idAttribute: "slug",

  initialize: function() {
    this.set({ slug: this.slugify() });
  },

  slugify: function(title) {
    return this.get("title").toLowerCase().replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

// Posts collection.
var Posts = Backbone.Collection.extend({
  model: Post,

  comparator: function(post) {
    return -1 * new Date(post.get("posted"));
  },

  parse: function(resp) {
    return resp.filter(function(post) {
      return !post.hidden;
    });
  },

  sync: function(method, model, options) {
    var metadata = [];
    var count = 1;
    
    fs.readdir("content/posts/", function(err, folders) {
      folders.forEach(function(folder) {
        content.meta(folder + "/", function(meta) {
          meta.metadata.path = folder + "/";
          metadata.push(meta.metadata);
          count++;

          if (count === folders.length) {
            options.success(metadata);
          }
        });
      });
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
//posts.on("sync", function() {
//  // Add each post into the rss feed
//  posts.each(function(post) {
//    this.feed.item({
//      title: post.get("title"),
//      description: post.get("title"),
//      date: post.get("posted"),
//      url: "http://tbranyen.com/post/" + post.id
//    });
//  }, posts);
//});

// TODO FileSystem Updates.

// Always fetch immediately
posts.fetch();

// Expose the posts.
module.exports = posts;
