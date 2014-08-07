module.exports = ->
  @loadNpmTasks "grunt-zopfli"

  @config "zopfli",
    release:
      options:
        iterations: 50
        format: "zlib"

      files:
        "public/dist/styles.min.css.gz": "public/dist/styles.min.css"
