var moment = require("moment");

module.exports = function(date) {
  return moment(date).format("dddd, MMM D, YYYY");
};
