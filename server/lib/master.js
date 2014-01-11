const cluster = require("cluster");
const os = require("os");

var workers = [];

function restartWorker() {
  this.kill("SIGHUP");

  workers.splice(workers.indexOf(this), 1, createWorker());
}

function createWorker() {
  var worker = cluster.fork();

  worker.on("exit", restartWorker.bind(worker));
  worker.on("error", restartWorker.bind(worker));

  return worker;
}

exports.startup = function() {
  workers.push.apply(workers, os.cpus().map(createWorker));
};

exports.teardown = function() {
  workers.forEach(function(worker) {
    worker.kill("SIGHUP");
  });

  workers.length = 0;
};

exports.restart = function() {
  exports.teardown();
  exports.startup();
};
