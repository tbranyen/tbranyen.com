module.exports = ->
  @loadNpmTasks "grunt-contrib-watch"

  @config "watch",
    development:
      files: [
        "templates/**/*.*"
        "themes/**/*.*"
        "server/**/*.*"
        "content/**/*.*"
        "public/js/*.*"
      ]

      tasks: [
        "stylus"
        "cssmin"
      ]
      
      options:
        livereload: true
