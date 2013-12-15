const git = require("nodegit");
const fs = require("fs");
const flow = require("./flow");
const Q = require("q");

exports.opts = {};

exports.file = function(filePath, rev) {
  var opts = this.opts;

  return Q.ninvoke(git.Repo, "open", opts.path).then(function(repo) {
    // Commits will override branches.
    var method = rev ? "getCommit" : "getBranch";

    // If a commit was specified use that revision, otherwise default to
    // branch.
    return Q.ninvoke(repo, method, rev || opts.branch).then(function(commit) {
      return Q.all([
        // Look up this specific file in the given commit/branch.
        Q.ninvoke(commit, "getEntry", filePath),
        // Get the file diffs.
        Q.ninvoke(commit, "getDiff")
      ]);
    }).spread(function(tree, diffList) {
      var diffs = diffList.reduce(function(memo, diff) {
        diff.patches().forEach(function(patch) {
          var oldFile = patch.oldFile().path();
          var newFile = patch.newFile().path();

          memo[newFile] = memo[newFile] || [];

          patch.hunks().forEach(function(hunk) {
            memo[newFile].push({ header: hunk.header(), lines: hunk.lines() });
          });
        });

        return memo;
      }, {});

      // Read in the file's content.
      return Q.all([Q.ninvoke(tree, "getBlob"), diffs]);
    }).spread(function(blob, diffs) {
      return [blob.toString(), diffs];
    }).fail(function(err) {
      // Attempt to load from filesystem.
      return Q.ninvoke(fs, "readFile", opts.path + filePath).then(function(contents) {
        // No revisions when pulling from FS.
        return [String(contents), []];
      });
    });

    /*
          // Send back the revisions for each file as well.
          //return Q.invoke(exports, "history", filePath).then(function(revs) {
            //return [entry, revs];
            console.log(blob.toString());
          //});
        });
      })
    });
    */
  });
};

exports.history = function(filePath, callback) {
  var opts = this.opts;
  var lastSha;

  Q.ninvoke(git.Repo, "open", opts.path).then(function(repo) {
    Q.ninvoke(repo, "getBranch", opts.branch).then(function(branch) {
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
