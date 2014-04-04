const fs = require("fs");
const path = require("path");
const combyne = require("combyne");
const Q = require("q");

/**
 * Given a layout and page name, fetch both of these templates and configure
 * the layout as a template.
 */
function page(layout, page) {
  // Normalize the paths.
  layout = path.resolve("templates/layouts/" + layout + ".html");
  page = path.resolve("templates/" + page + ".html");

  // Return a chainable Promise that 
  return Q.all([
    // Wait for the layout and turn it into a Combyne template function.
    Q.ninvoke(fs, "readFile", layout).then(function(buffer) {
      return combyne(String(buffer));
    }),

    Q.ninvoke(fs, "readFile", page)
  ]).fail(console.log.bind(console));
};

module.exports = page;
