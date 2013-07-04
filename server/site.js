process.on("message", function(msg) {
  switch (msg.cmd) {
    case "kill":
      process.exit(0);
      break;

    case "refresh":
      all.reset([]);
      all.fetch();

      posts.reset([]);
      posts.fetch();

      break;
  }
});

// Require server dependencies
var Backbone = require("backbone");
var combyne = require("combyne");
var content = require("./content");
var fs = require("fs");
var exec = require("child_process").exec;
var express = require("express");
var request = require("request");
var moment = require("moment");
var RSS = require("rss");
var path = require("path");

var Projects = Backbone.Collection.extend({
  sync: function(method, model, options) {
    request(model.url(), function(error, response, body) {
      if (error) { return; }

      var data = JSON.parse(body);

      if (!data.length) {
        model.page = 1;
        return options.success(model.models);
      }

      model.add(data, { silent: true });

      model.page = model.page + 1;
      model.fetch();
    });
  },

  comparator: function(project) {
    return -1 * new Date(project.get("pushed_at"));
  },

  page: 1,

  url: function() {
    return "https://api.github.com/users/" + this.owner + "/repos?page=" + this.page;
  },

  initialize: function(models, options) {
    this.owner = options && options.owner;
  }
});

// Set the projects collection to tbranyen
var all = new Projects([], { owner: "tbranyen" });
var mine = new Projects();
var forks = new Projects();

var History = Backbone.Collection.extend({});

var Post = Backbone.Model.extend({
  idAttribute: "slug",

  initialize: function() {
    this.set({ slug: this.slugify() });

    // Create a new history collection
    this.history = new History({ slug: this.get("slug") });
  },

  slugify: function(title) {
    return this.get("title").toLowerCase().replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

// TODO: Update this to pull directly from Git
// Posts collection
var Posts = Backbone.Collection.extend({
  model: Post,

  comparator: function(post) {
    return -1 * new Date(post.get("posted"));
  },

  sync: function(method, model, options) {
    var metadata = [];
    var count = 0;
    
    fs.readdir("../site-content/posts/", function(err, files) {
      // Ensure there are files
      files && files.forEach(function(file) {
        if (file[0] !== ".") {
          content.doc.meta(file + "/", function(meta) {
            meta.metadata.path = file + "/";
            metadata.push(meta.metadata);
            count++;

            if (count === files.length) {
              options.success(metadata);
            }
          });
        }
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

// When its filled...
all.bind("reset", function() {
  // Get only my repos
  mine.reset(all.filter(function(project) {
    return !project.get("fork");
  }));

  // Get all my forks
  forks.reset(all.filter(function(project) {
    return project.get("fork");
  }));
});

// When posts are updated add to the feed
posts.bind("reset", function() {
  // Add each post into the rss feed
  posts.each(function(post) {
    this.feed.item({
      title: post.get("title"),
      description: post.get("title"),
      date: post.get("posted"),
      url: "http://tbranyen.com/post/" + post.id
    });
  }, posts);
});

// Fetch all projects and posts once a day
setInterval(function() {
  all.reset([]);
  all.fetch();

  posts.reset([]);
  posts.fetch();

// Update every hour
}, 3600000);

// Always fetch immediately
posts.fetch();
all.fetch();

// Create the site server
var site = express();

function getLayout(name, callback) {
  var realPath = path.resolve("templates/layouts/" + name + ".html");

  fs.readFile(realPath, function(err, buffer) {
    if (err) { return callback(err); }

    callback(null, combyne(buffer.toString()));
  });
}

// Serve static styles.
site.use("/styles", express.static(path.resolve("styles")));

// Resume
site.get("/resume", function(req, res) {
  try {
    getLayout("index", function(err, tmpl) {
      fs.readFile("./templates/resume.html", function(err, buf) {
        tmpl.partials.add("content", buf.toString(), {});

        res.send(tmpl.render({
          resume_active: "active",
        }));
      });
    });
  } catch(ex) {
    res.send("internal error");
  }
});

// Projects
site.get("/projects", function(req, res) {
  try {
    getLayout("index", function(err, tmpl) {
      if (err) { return res.send(500); }

      fs.readFile("templates/projects.html", function(err, buf) {
        tmpl.partials.add("content", buf.toString(), {
          mine: mine.toJSON(),
          forks: forks.toJSON()
        });

        res.send(tmpl.render({
          title: "Projects | Tim Branyen @tbranyen",
          projects_active: "active",
        }));
      });
    });
  } catch(ex) {
    res.send("internal error");
  }
});

// Post
site.get("/post/:id", function(req, res) {
  getLayout("index", function(err, tmpl) {
    if (err) { return res.send(500); }

    fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
      tmpl.filters.add("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      try {
        var post = posts.get(req.params.id).toJSON();

        content.doc.assemble(post.path, function(html) {
          tmpl.partials.add("content", buf.toString(), {
            post: post,
            content: html
          });

          res.send(tmpl.render({
            title: post.title + " | Tim Branyen @tbranyen",
            post_active: "active"
          }));
        });
      } catch(ex) {
        res.send("internal error");
      }
    });
  });
});

site.get("/post/:id/assets/*", function(req, res) {
  var post = "/../../content/posts/" +
    posts.get(req.params.id).toJSON().path;

  // The actual asset path
  var assetPath = req.params[0];

  if (path.relative(assetPath, __dirname) === "../lib") {
    return fs.createReadStream(__dirname + post + "assets/" + assetPath).pipe(res);
  }

  // Whatever, hackers.
  res.send(420);
});

function home(req, res) {
  getLayout("index", function(err, tmpl) {
    if (err) {
      return res.send(500);
    }

    var realPath = path.resolve("templates/home.html");

    fs.readFile(realPath, function(err, buf) {
      tmpl.filters.add("formatDate", function(date) {
        return moment(date).format("dddd, MMM D, YYYY");
      });

      tmpl.partials.add("content", buf.toString(), {
        posts: posts.toJSON()
      });

      res.send(tmpl.render({
        title: "Tim Branyen @tbranyen",
        post_active: "active"
      }));
    });
  });
}

site.get("/rss.xml", function(req, res) {
  res.writeHead(200, { "Content-Type": "application/rss+xml" });
  res.end(posts.rss());
});

site.post("/reload/" + process.env["SITE_CONTENT_KEY"], function(req, res) {
  exec("cd ../site-content; git pull; cd ../server", function() {
    process.send({ cmd: "reload" });
  });
});

// Homepage
site.get("/", home);
site.get("*", home);

site.listen(1987);