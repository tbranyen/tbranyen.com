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

// Homepage
site.get("/", function(req, res) {
  getLayout("index", function(err, tmpl) {
    //tmpl.partials.add("content", html, {});

    res.send(tmpl.render());
  });
});

site.listen(1987);
