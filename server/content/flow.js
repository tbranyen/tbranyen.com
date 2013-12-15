const _ = require("underscore.deferred");

exports.promisfy = function(context, fn) {
  var def = new _.Deferred();

  // Call the original function reference, passing the arguments as an array
  // or single value that are concatentated with the standard callback function
  // which access the standard error object and return value.
  context[fn].apply(context || this, [].concat([].slice.call(arguments, 2), function(err, retValue) {
    if (err) {
      return def.reject(err);
    }

    return def.resolve(retValue);
  }));

  return def.promise();
};

exports.promisfyEvent = function(context, fn) {
  var def = new _.Deferred();

  context[fn].apply(context, [].concat([].slice.call(arguments, 2), function(err, retValue) {
    def.notify(retValue);
  }));

  context[fn].call(context, "end", function() {
    def.resolve();
  });

  return def.promise();
};

exports.when = _.when;
