module.exports = ->
  @loadTasks "grunt"

  @registerTask "default", [
    "express"
    "stylus"
    "watch"
  ]

  @registerTask "build", [
    "clean"
    "stylus"
    "cssmin"
  ]

  @registerTask "deploy:stage", [
    "build"
    "rsync:staging"
  ]

  @registerTask "deploy:prod", [
    "build"
    "rsync:production"
  ]
