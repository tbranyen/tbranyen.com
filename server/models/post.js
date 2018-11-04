const Backbone = require("backbone");

var Post = Backbone.Model.extend({
  idAttribute: "slug",

  initialize: function() {
    this.set({ slug: this.slugify() });
  },

  slugify: function() {
    return this.get("title").toLowerCase().replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports = Post;
