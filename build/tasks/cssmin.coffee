module.exports = ->
  @loadNpmTasks "grunt-contrib-cssmin"

  @config "cssmin",
    release:
      files:
        "dist/dist/styles.min.css": ["dist/styles.css"]
