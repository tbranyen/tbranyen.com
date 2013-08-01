var Backbone = require("backbone");

var Projects = Backbone.Collection.extend({
  sync: function(method, model, options) {
    request(model.url(), function(error, response, body) {
      if (error) { return; }

      var data = JSON.parse(body);

      if (!data.length) {
        model.page = 1;
        return options.success(model.models);
      }

      model.add(data, { silent: true });

      model.page = model.page + 1;
      model.fetch();
    });
  },

  comparator: function(project) {
    return -1 * new Date(project.get("pushed_at"));
  },

  page: 1,

  url: function() {
    return "https://api.github.com/users/" + this.owner + "/repos?page=" + this.page;
  },

  initialize: function(models, options) {
    this.owner = options && options.owner;
  }
});

exports.allForUser = function(username) {
  return {
    all: new Projects([], { owner: username }),
    mine: new Projects(),
    forks: new Projects()
  };
};

// TODO Update on interval.
//setInterval(function() {
//  all.reset([]);
//  all.fetch();
//// Update every hour
//}, 3600000);
//
//// FIXME
//all.fetch();
//
//// When its filled...
//all.on("sync", function() {
//  // Get only my repos
//  mine.reset(all.filter(function(project) {
//    return !project.get("fork");
//  }));
//
//  // Get all my forks
//  forks.reset(all.filter(function(project) {
//    return project.get("fork");
//  }));
//});
