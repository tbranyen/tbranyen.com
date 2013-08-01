var EventEmitter = require("events").EventEmitter;

function monitor(process) {
  var emitter = this;

  process.on("message", function(msg) {
    switch (msg.cmd) {
      case "kill":
        process.exit(0);
        break;

      case "refresh":
        emitter.emit("refresh");

        break;
    }
  });
}

exports.attachTo = function(process) {
  var emitter = new EventEmitter();

  monitor.call(emitter, process);

  return emitter;
};
