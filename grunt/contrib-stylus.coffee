config = require "../config.json"

module.exports = ->
  @config "stylus",
    development:
      files:
        "dist/styles.css": "themes/#{config.theme}/index.styl"

  @loadNpmTasks "grunt-contrib-stylus"
