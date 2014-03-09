module.exports = ->
  @loadNpmTasks "grunt-zopfli"

  @config "zopfli",
    release:
      options:
        iterations: 50
        format: "zlib"

      files:
        "dist/styles.min.css.gz": "dist/styles.min.css"
