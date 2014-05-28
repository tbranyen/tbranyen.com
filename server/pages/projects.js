function projects(req, res) {
  res.render("projects", {
    title: "Projects | Tim Branyen @tbranyen",
    projects_active: "active",
    node_env: process.env.NODE_ENV
  });
}

module.exports = function(site) {
  site.get("/projects", projects);
};
