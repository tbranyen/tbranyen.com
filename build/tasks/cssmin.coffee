module.exports = ->
  @config "cssmin",
    release:
      files:
        "dist/dist/styles.min.css": ["dist/styles.css"]

  @loadNpmTasks "grunt-contrib-cssmin"
