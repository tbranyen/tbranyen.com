module.exports = ->
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
        "server:development"
      ]
      
      options:
        livereload: true

  @loadNpmTasks "grunt-contrib-watch"
