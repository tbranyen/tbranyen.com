module.exports = ->
  @loadNpmTasks "grunt-contrib-stylus"

  config = @file.readJSON "package.json"

  @config "stylus",
    development:
      files:
        "dist/styles.css": "themes/#{config.site.theme}/index.styl"
