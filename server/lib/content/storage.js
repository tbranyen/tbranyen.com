var git = require('nodegit');

module.exports = {
  opts: {},

  file: function(filePath, rev, callback) {
    callback = (rev && typeof rev === 'function') ? rev : callback;

    // Define these out of git scope to reuse later on
    var repo, branch;
    var opts = this.opts;

    git.repo(opts.path, function(err) {
      if (err) { throw new Error(err); }
      repo = this;

      repo.branch(opts.branch, function(err) {
        if (err) { throw new Error(err); }
        branch = this;

        cont();
      });
    });

    function cont() {
      if (!callback) { return; };

      var history, finishCallback;
      var shas = [];
      var wait = 0;
      var end = false;

      function testFinish() {
        if(wait === 0 && end) {
          finishCallback(shas);
        }
      }

      // If revision is actually the callback, assume you want the HEAD file
      if (typeof rev === 'function') {
        history = branch.history();

        history.on('commit', function(commit) {
          wait++;

          commit.tree().entry(filePath, function(entry) {
            wait--;

            entry && shas.push({ sha: commit.sha, content: entry.content });

            testFinish();
          });
        });

        history.on('end', function() {
          finishCallback = function() {
            return callback(shas);
          };

          end = true;

          testFinish();
        });
      }
      else if (rev === 'head') {
        branch.tree().entry(filePath, function(entry) {
          entry && callback({ sha: branch.sha, content: entry.content });
        });
      }
      else {
        repo.commit(rev, function(err, commit) {
          commit.tree().entry(filePath, function(entry) {
            entry && callback({ sha: commit.sha, content: entry.content });
          });
        });
      }
    }
  },

  history: function(filePath, callback) {

    var repo, branch;
    var opts = this.opts;

    git.repo(opts.path, function(err) {
      repo = this;

      repo.branch(opts.branch, function(err) {
        branch = this;

        cont();
      });
    });

    function cont() {
      if (!callback) { return; };
    
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
      history.on('commit', function(commit) {
        finish.inc();

        var walk = commit.tree().walk();
        walk.on('entry', function(idx, entry) {
          if (entry.name === filePath && lastSha !== entry.sha) {
            lastSha = entry.sha;
            shas.push(commit.sha);
          }
        });

        walk.on('end', finish.dec);
      });

      history.on('end', finish.dec);
    }
  },

  use: function(path, branch) {
    this.opts.path = path;
    this.opts.branch = branch;
  }
};
