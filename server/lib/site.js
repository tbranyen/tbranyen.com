// Require process dependencies
var os = require("os");
var readline = require("readline");
var cluster = require("cluster");

// Var up, bro
var i, read;
var forks = [];
var prefix = "server ~ ";

// Master thread spawns new listeners
if (cluster.isMaster) {
  function create() {
    // Spawn a new worker for each available thread
    for (i = 0; i < os.cpus().length; i++) {
      forks.push(cluster.fork());
    }
  }

  function destroy() {
    // Destroy all original forks
    forks.forEach(function(fork) {
      fork.send({ cmd: "kill" });
    });

    forks = [];
  }

  var command;
  var commands = {
    "status": function() {
      forks.forEach(function(fork) {
        console.log("Worker", fork.pid, fork.online ? "online" : "offline");
      });
    },

    // Destroy all forks and respawn new ones
    "restart": function() {
      destroy() && create();
    },

    // Destroy all forks and kill this master process
    "stop": function() {
      destroy();

      process.exit(0);
    }
  };

  // Spin up initial forks
  create();

  // Define prompt
  read = readline.createInterface(process.stdin, process.stdout);

  // Wait for data
  read.on("line", function(line) {
    command = line.trim()

    // Detect if command exists
    if (command in commands) {
      commands[command]();
    }

    // Re-Show the prompt
    read.setPrompt(prefix, prefix.length);
    read.prompt();
  })
  
  read.on("close", function() {
    destroy();
    process.exit(0);
  });

  // Show prompt
  read.setPrompt(prefix, prefix.length);
  read.prompt();

  return;
}

// Kill off the process
process.on("message", function(msg) {
  if (msg.cmd && msg.cmd == "kill") {
    process.exit();
  }
});

// Require server dependencies
Backbone = require("backbone");

var combyne = require("combyne");
//var content = require("./content");
var fs = require("fs");
var express = require("express");

Backbone.sync = function(method, model, options) {
  return options.success(require("./content/github.json"));
};

var Projects = Backbone.Collection.extend({

  //parse: function(response) {
  //  return response.repositories;
  //},

  comparator: function(project) {
    return -1 * new Date(project.get("pushed_at"));
  },

  url: function() {
    return "http://github.com/api/v2/json/repos/show/" + this.owner;
  },

  initialize: function(models, options) {
    this.owner = options && options.owner;
  }

});

// Set the projects collection to tbranyen
var projects = new Projects([], { owner: "tbranyen" });
var mine = new Projects();
var forks = new Projects();

// When its filled...
projects.bind("reset", function() {
  mine.reset(projects.filter(function(project) {
    return !project.get("fork");
  }));

  forks.reset(projects.filter(function(project) {
    return project.get("fork");
  }));
});

// Fetch all projects
setInterval(function() {
  projects.fetch();

// Update once per day
}, 1 * 24 * 3600000);

// Always fetch immediately
projects.fetch();

// Create the site server
var site = express.createServer();

function getLayout(name, callback) {
  fs.readFile("../client/templates/layouts/" + name + ".html", function(err, buffer) {
    if (err) { callback(err); }

    callback(null, combyne(buffer.toString()));
  });
}

// Serve static assets
site.use("/assets", express.static("../client/assets"));

// Resume
site.get("/resume", function(req, res) {
  getLayout("index", function(err, tmpl) {
    tmpl.delimiters = {
      FILTER: "`"
    };

    fs.readFile("../client/templates/resume.html", function(err, buf) {
      tmpl.partials.add("content", buf.toString(), {});

      res.send(tmpl.render({
        resume_active: "active",
      }));
    });
  });
});

// Projects
site.get("/projects", function(req, res) {
  getLayout("index", function(err, tmpl) {
    tmpl.delimiters = {
      FILTER: "`"
    };

    fs.readFile("../client/templates/projects.html", function(err, buf) {
      tmpl.partials.add("content", buf.toString(), {
        mine: mine.toJSON(),
        forks: forks.toJSON()
      });

      res.send(tmpl.render({
        projects_active: "active",
      }));
    });
  });
});

// Post
site.get("/post/:id", function(req, res) {
  getLayout("index", function(err, tmpl) {
    tmpl.delimiters = {
      FILTER: "`"
    };

    fs.readFile("../client/templates/post.html", function(err, buf) {
      tmpl.partials.add("content", buf.toString(), {});

      res.send(tmpl.render({
        post_active: "active"
      }));
    });
  });
});

// Homepage
site.get("/", function(req, res) {
  getLayout("index", function(err, tmpl) {
    tmpl.delimiters = {
      FILTER: "`"
    };

    fs.readFile("../client/templates/home.html", function(err, buf) {
      tmpl.partials.add("content", buf.toString(), {});

      res.send(tmpl.render({
        post_active: "active"
      }));
    });
  });
});

site.listen(1987);
