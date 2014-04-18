const fs = require("fs");
const Backbone = require("backbone");
const RSS = require("rss");
const consumare = require("consumare");
const Q = require("q");

var basePath = __dirname + "/../../";
var config = require(basePath + "package.json").site;

// Locate the configuration and set the engine.
consumare.configure(basePath, config);

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
    return resp;
  },

  sync: function(method, model, options) {
    var metadata = [];
    var count = 1;
    var deferred = Q.defer();
    
    fs.readdir("content/posts/", function(err, folders) {
      folders.forEach(function(folder) {
        consumare.meta("posts/" + folder + "/post.md", function(meta) {
          meta.metadata.path = folder + "/";
          metadata.push(meta.metadata);
          count++;

          if (count === folders.length) {
            options.success(metadata);
            deferred.resolve(metadata);
          }
        });
      });
    });

    return deferred.promise;
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

// Expose the posts.
module.exports = new Posts().fetch();
