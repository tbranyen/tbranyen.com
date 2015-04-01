module.exports = ->
  @loadNpmTasks "grunt-codeblock-jshint"

  @config "codeblock-jshint",
    content:
      src: [
        'content/**/*.md'
      ]
