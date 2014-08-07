module.exports = ->
  @loadNpmTasks "grunt-contrib-cssmin"

  @config "cssmin",
    release:
      files:
        "public/dist/styles.min.css": ["public/dist/styles.css"]
