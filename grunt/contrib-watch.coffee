module.exports = ->
  @config "watch",
    development:
      files: [
        "templates/**/*.*"
        "styles/**/*.*"
        "server/**/*.*",
        "content/**/*.*"
      ]

      tasks: ["stylus", "cssmin"]
      
      options:
        livereload: true

  @loadNpmTasks "grunt-contrib-watch"
