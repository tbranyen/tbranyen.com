module.exports = ->
  @config "cssmin",
    release:
      files:
        "dist/styles.min.css": [
          "styles/normalize"
          "dist/main.css"
        ]

  @loadNpmTasks "grunt-contrib-cssmin"
