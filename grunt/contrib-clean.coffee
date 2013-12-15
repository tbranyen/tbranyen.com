module.exports = ->
  @config "clean", ["dist/"]

  @loadNpmTasks "grunt-contrib-clean"
