module.exports = ->
  @loadNpmTasks "grunt-contrib-watch"

  @config "watch",
    development:
      files: [
        "templates/**/*.*"
        "themes/**/*.*"
        "server/**/*.*",
        "content/**/*.*"
      ]

      tasks: [
        "stylus"
        "cssmin"
      ]
      
      options:
        livereload: true
