module.exports = ->
  @config "watch",
    development:
      files: [
        "templates/**/*.*"
        "themes/**/*.*"
        "server/**/*.*",
        "content/**/*.*"
      ]

      tasks: ["stylus", "cssmin", "express"]
      
      options:
        livereload: true

  @loadNpmTasks "grunt-contrib-watch"
