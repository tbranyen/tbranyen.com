exports.attachTo = function(site) {

  site.get("/resume", function(req, res) {
    try {
      getLayout("index", function(err, tmpl) {
        fs.readFile("./templates/resume.html", function(err, buf) {
          tmpl.partials.add("content", buf.toString(), {});

          res.send(tmpl.render({
            resume_active: "active",
            node_env: process.env.NODE_ENV
          }));
        });
      });
    } catch(ex) {
      res.send("internal error");
    }
  });

};
