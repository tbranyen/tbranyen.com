module.exports = ->
  @initConfig

    clean: ["dist/"]

    sass:
      dist:
        files:
          "styles/main.css": "styles/scss/main.scss"

    express:
      options:
        background: true
        delay: 1

      development:
        options:
          script: "server/site.js"

    watch:
      development:
        files: [
          "templates/**/*.*"
          "styles/**/*.*"
          "server/**/*.*",
          "content/**/*.*"
        ]

        tasks: ["stylus"]
        
        options:
          livereload: true

    stylus:
      development:
        files:
          "dist/main.css": "styles/main.styl"

    cssmin:
      release:
        files:
          "dist/main.min.css": [
            "styles/normalize"
            "dist/main.css"
          ]

    zopfli:
      release:
        options:
          iterations: 50
          format: "zlib"

        files:
          "dist/main.min.css.gz": "dist/main.min.css"

  @loadNpmTasks "grunt-express-server"
  @loadNpmTasks "grunt-contrib-watch"
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-cssmin"
  @loadNpmTasks "grunt-contrib-stylus"
  @loadNpmTasks "grunt-zopfli"

  @registerTask "default", ["express", "stylus", "watch"]
  @registerTask "release", ["clean", "stylus", "cssmin", "zopfli"]
