module.exports = ->
  @loadTasks "grunt"

  @registerTask "default", ["express", "stylus", "watch"]
  @registerTask "deploy", ["clean", "stylus", "cssmin", "zopfli", "rsync"]
