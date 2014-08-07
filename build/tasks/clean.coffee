module.exports = ->
  @loadNpmTasks "grunt-contrib-clean"

  @config "clean", ["public/dist/"]
