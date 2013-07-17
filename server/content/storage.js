var git = require("nodegit");
var fs = require("fs");
var flow = require("./flow");
var Q = require("q");

exports.opts = {};

exports.file = function(filePath, rev, callback) {
  // Allow argument shifting.
  if (typeof rev === "function") {
    callback = rev;
    rev = undefined;
  }

  var opts = this.opts;

  Q.ninvoke(git, "repo", opts.path).then(function(repo) {
    // Commits will override branches.
    var method = rev ? "commit" : "branch";

    // If a commit was specified use that revision, otherwise default to
    // branch.
    Q.ninvoke(repo, method, rev || opts.branch).then(function(branch) {
      // Look up this specific file in the given commit/branch.
      Q.ninvoke(branch, "file", filePath).then(function(file) {
        // Read in the file's content.
        Q.ninvoke(file, "content").then(function(content) {
          // Send back the revisions for each file as well.
          exports.history(filePath, function(revs) {
            callback(content, revs);
          });
        });
      }).fail(function(err) {
        // Attempt to load from filesystem.
        Q.ninvoke(fs, "readFile", opts.path + filePath).then(function(contents) {
          // No revisions when pulling from FS.
          callback(String(contents), []);
        });
      });
    });
  });
};

exports.history = function(filePath, callback) {
  var opts = this.opts;
  var lastSha;

  Q.ninvoke(git, "repo", opts.path).then(function(repo) {
    Q.ninvoke(repo, "branch", opts.branch).then(function(branch) {
      var shas = [];
      var revs = [];
      var history = flow.promisfyEvent(branch.history(), "on", "commit");

      history.progress(function(commit) {
        var sha = flow.promisfy(commit, "sha");
        var tree = flow.promisfy(commit, "tree");

        revs.push(flow.when([sha, tree]).then(function(commitSha, tree) {
          var tree = flow.promisfyEvent(tree.walk(), "on", "entry");

          tree.progress(function(entry) {
            var path = flow.promisfy(entry, "path");
            var sha = flow.promisfy(entry, "sha");

            return flow.when([path, sha]).then(function(path, sha) {
              if (path === filePath && lastSha !== sha) {
                lastSha = sha;
                shas.push(commitSha);
              }
            });
          });

          return tree;
        }));
      });

      history.then(function() {
        flow.when(revs).then(function() {
          callback(shas);
        });
      });
    });
  });
};

exports.use = function(path, branch) {
  this.opts.path = path;
  this.opts.branch = branch;
};
