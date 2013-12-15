module.exports = ->
  @config "stylus",
    development:
      files:
        "dist/main.css": "styles/main.styl"

  @loadNpmTasks "grunt-contrib-stylus"
