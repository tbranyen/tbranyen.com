var git = require('nodegit');

module.exports = function(self) {
  var opts = {};

  self.file = function(filePath, rev, callback) {
    callback = (rev && typeof rev === 'function') ? rev : callback;

    var repo, branch;
    git.repo(opts.path, function(err) {
      repo = this;

      repo.branch(opts.branch, function() {
        branch = this;

        cont();
      });
    });

    function cont() {
      if(!callback) { return; };

      var shas = [];
      var wait = 0;
      var end = false;
      var finishCallback;

      function testFinish() {
        if(wait === 0 && end) {
          finishCallback(shas);
        }
      }

      if(typeof rev === 'function') {
        var history = branch.history();
        history.on('commit', function(commit) {
          wait++;
          commit.tree().entry(filePath, function(entry) {
            wait--;
            if(entry) {
              shas.push({ sha: commit.sha, content: entry.content });
            }

            testFinish();
          });
        });

        history.on('end', function() {
          finishCallback = function() { return callback(shas); };
          end = true;
          testFinish();
        });
      }
      else if(rev === 'head') {
        branch.tree().entry(filePath, function(entry) {
          if(entry) {
            callback({ sha: branch.sha, content: entry.content });
          }
        });
      }
      else {
        repo.commit(rev, function(err, commit) {
          commit.tree().entry(filePath, function(entry) {
            if(entry) {
              callback({ sha: commit.sha, content: entry.content });
            }
          });
        });
      }
    }
  }
  
  self.history = function(filePath, callback) {
    var repo, branch;
    git.repo(opts.path, function(err) {
      repo = this;

      repo.branch(opts.branch, function(err) {
        branch = this;

        cont();
      });
    });

    function cont() {
      if(!callback) { return; };
    
      var shas = []
        , lastSha;

      function complete(cb) {
        var i = 0;

        return {
          inc: function() {
            i = i+1;
          }
        , dec: function() {
            if(!(i = i-1)) {
              cb();

              // Ensure correct reset
              cb = undefined;
              i = 0;
            }
          }
        };
      }

      var finish = complete(function() {
        callback(shas);
      });

      finish.inc();

      var history = branch.history();
      history.on('commit', function(commit) {
        finish.inc();

        var walk = commit.tree().walk();
        walk.on('entry', function(idx, entry) {
          if(entry.name === filePath && lastSha !== entry.sha) {
            lastSha = entry.sha;
            shas.push(commit.sha);
          }
        });

        walk.on('end', finish.dec);
      });

      history.on('end', finish.dec);
    }
  };
  
  self.use = function(path, branch) {
    opts.path = path;
    opts.branch = branch;
  };

  return self;
}({});
