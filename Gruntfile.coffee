module.exports = ->
  @initConfig
    theme: "default"

    content:
      repo: "content/"
      branch: "master"

  @loadTasks "build/tasks"

  @registerTask "default", [
    "express:development"
    "stylus"
    "watch"
  ]

  @registerTask "build", [
    "express:production"
    "clean"
    "stylus"
    "cssmin"
    "static"
  ]

  @registerTask "deploy:staging", [
    "build"
    "rsync:staging"
  ]

  @registerTask "deploy:production", [
    "build"
    "rsync:production"
  ]
