const promisify = require("promisify-node");
const fs = promisify("fs");
const path = require("path");
const combyne = require("combyne");
const moment = require("moment");
const Q = require("q");

/**
 * Given a layout and page name, fetch both of these templates and configure
 * the layout as a template.
 */
function createPage() {
  arguments.__proto__ = Array.prototype;

  // Normalize the paths.
  var pages = arguments.map(function(page) {
    return path.resolve("templates/" + page + ".html");
  }).map(function(normalized) {
    // Read in the file as a Buffer, convert to a String, and then process with
    // Combyne.
    return fs.readFile(normalized)
      .then(String)
      .then(combyne)
      // Register date formatting to all pages.
      .then(function(page) {
        page.registerFilter("formatDate", function(date) {
          return moment(date).format("dddd, MMM D, YYYY");
        });

        return page;
      });
  });

  // Fetch all templates asynchronously.
  return Q.all(pages).fail(console.error.bind(console));
};

module.exports = createPage;
