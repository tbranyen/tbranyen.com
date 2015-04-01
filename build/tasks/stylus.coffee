module.exports = ->
  @loadNpmTasks "grunt-contrib-stylus"

  config = @file.readJSON "package.json"

  @config "stylus",
    development:
      options:
        "include css": true

      files:
        "public/dist/styles.css": "themes/#{config.site.theme}/index.styl"
