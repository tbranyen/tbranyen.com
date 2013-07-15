var git = require("nodegit");
var Q = require("q");
var fs = require("fs");

exports.opts = {};

exports.file = function(filePath, rev, callback) {
  // Allow argument shifting.
  if (typeof rev === "function") {
    callback = rev;
    rev = undefined;
  }

  var opts = this.opts;

  git.repo(opts.path, function(err, repo) {
    if (err) { throw new Error(err); }

    // Commits will override branches.
    var method = rev ? "commit" : "branch";

    // If a commit was specified use that revision, otherwise default to
    // branch.
    repo[method](rev || opts.branch, function(err, branch) {
      if (err) { throw new Error(err); }

      branch.file(filePath, function(err, file) {
        if (err) {
          // Attempt to load from filesystem.
          return fs.readFile(opts.path + filePath, function(err, contents) {
            if (err) { throw new Error(err); }

            // No revisions when pulling from FS.
            callback(String(contents), []);
          });
        }

        file.content(function(err, content) {
          // Send back the revisions for each file as well.
          exports.history(filePath, function(revs) {
            callback(content, revs);
          });
        });
      });
    });
  });
};

exports.history = function(filePath, callback) {
  var opts = this.opts;

  git.repo(opts.path, function(err, repo) {
    if (err) { throw new Error(err); }

    repo.branch(opts.branch, function(err, branch) {
      if (err) { throw new Error(err); }

      var finish, history, lastSha;
      var shas = [];

      function complete(cb) {
        var i = 0;

        return {
          inc: function() {
            i = i+1;
          },

          dec: function() {
            if(!(i = i-1)) {
              cb();

              // Ensure correct reset
              cb = undefined;
              i = 0;
            }
          }
        };
      }

      finish = complete(function() {
        callback(shas);
      });

      finish.inc();

      history = branch.history();
      history.on("commit", function(err, commit) {
        finish.inc();

        commit.sha(function(err, commitSha) {
          commit.tree(function(err, tree) {
            var walk = tree.walk();

            walk.on("entry", function(err, entry) {
              entry.path(function(err, path) {
                entry.sha(function(err, sha) {
                  if (path === filePath && lastSha !== sha) {
                    lastSha = sha;
                    shas.push(commitSha);
                  }
                });
              });
            });

            walk.on("end", finish.dec);
          });
        });
      });

      history.on("end", finish.dec);
    });
  });
};

exports.use = function(path, branch) {
  this.opts.path = path;
  this.opts.branch = branch;
};
