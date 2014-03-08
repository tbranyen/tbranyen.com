module.exports = ->
  @loadTasks "build/tasks"

  @registerTask "default", [
    "express:development"
    "stylus"
    "watch"
  ]

  @registerTask "build", [
    "clean"
    "stylus"
    "cssmin"
  ]

  @registerTask "deploy:staging", [
    "build"
    "rsync:staging"
  ]

  @registerTask "deploy:production", [
    "build"
    "rsync:production"
  ]
