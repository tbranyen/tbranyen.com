var git = require('nodegit');

module.exports = {
  opts: {},

  file: function(filePath, rev, callback) {
    callback = (rev && typeof rev === 'function') ? rev : callback;

    var opts = this.opts;

    git.repo(opts.path, function(err, repo) {
      if (err) { throw new Error(err); }

      repo.branch(opts.branch, function(err, branch) {
        if (err) { throw new Error(err); }

        branch.file(filePath, function(err, contents) {
          if (err) { throw new Error(err); }

          contents.content(function(err, content) {
            callback(content);
          });
        });
      });
    });
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
