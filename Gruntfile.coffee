module.exports = ->
  @loadTasks "grunt"

  @registerTask "default", [
    "express"
    "stylus"
    "watch"
  ]

  @registerTask "deploy:stage", [
    "clean"
    "stylus"
    "cssmin"
    "zopfli"
    "rsync:staging"
  ]

  @registerTask "deploy:prod", [
    "clean"
    "stylus"
    "cssmin"
    "zopfli"
    "rsync:production"
  ]
