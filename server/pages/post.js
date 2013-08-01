exports.attachTo = function(site) {

  // Always the most current post.
  site.get("/post/:id", function(req, res) {
    getLayout("index", function(err, tmpl) {
      if (err) { return res.send(500); }

      fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
        tmpl.filters.add("formatDate", function(date) {
          return moment(date).format("dddd, MMM D, YYYY");
        });

        try {
          var post = posts.get(req.params.id).toJSON();

          content.assemble(post.path, function(html, revs) {
            tmpl.partials.add("content", buf.toString(), {
              post: post,
              revs: revs,
              content: html,
              url: req.url
            });

            tmpl.filters.add("slice", function(val, count) {
              return val.slice(0, count);
            });

            res.send(tmpl.render({
              title: post.title + " | Tim Branyen @tbranyen",
              post_active: "active"
            }));
          });
        } catch(ex) {
          res.send("internal error");
        }
      });
    });
  });

  // Specific post in history.
  site.get("/post/:id/:rev", function(req, res) {
    getLayout("index", function(err, tmpl) {
      if (err) { return res.send(500); }

      fs.readFile(path.resolve("templates/post.html"), function(err, buf) {
        tmpl.filters.add("formatDate", function(date) {
          return moment(date).format("dddd, MMM D, YYYY");
        });

        try {
          var post = posts.get(req.params.id).toJSON();

          content.assemble(post.path, req.params.rev, function(html, revs) {
            tmpl.partials.add("content", buf.toString(), {
              post: post,
              revs: revs,
              content: html,
              url: req.url
            });

            tmpl.filters.add("slice", function(val, count) {
              return val.slice(0, count);
            });

            res.send(tmpl.render({
              title: post.title + " | Tim Branyen @tbranyen",
              post_active: "active"
            }));
          });
        } catch(ex) {
          res.send(404);
        }
      });
    });
  });

  site.get("/post/:id/assets/*", function(req, res) {
    var post = "/../content/posts/" +
      posts.get(req.params.id).toJSON().path;

    // The actual asset path
    var assetPath = req.params[0];

    if (path.relative(assetPath, __dirname) === "../server") {
      return fs.createReadStream(__dirname + post + "assets/" + assetPath).pipe(res);
    }

    // Whatever, hackers.
    res.send(420);
  });

};
