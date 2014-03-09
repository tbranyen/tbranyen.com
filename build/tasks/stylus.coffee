module.exports = ->
  @loadNpmTasks "grunt-contrib-stylus"

  config = @file.readJSON "config.json"

  @config "stylus",
    development:
      files:
        "dist/styles.css": "themes/#{config.theme}/index.styl"
