# Grunt configuration updated to latest Grunt.  That means your minimum
# version necessary to run these tasks is Grunt 0.4.
#
# Please install this locally and install `grunt-cli` globally to run.
module.exports = ->

  # Initialize the configuration.
  @initConfig

    # Compile SASS.
    sass:
      dist:
        files:
          "styles/main.css": "styles/scss/main.scss"

    # Run the site server.
    express:
      options:
        background: true
        delay: 1

      development:
        options:
          script: "server/site.js"

    # For development this will automatically build and reload while I'm
    # working.
    watch:
      development:
        files: [
          "templates/**/*.*"
          "styles/**/*.*"
          "server/**/*.*"
        ]

        tasks: ["stylus"]
        
        options:
          livereload: true

    # The clean task ensures all files are removed from the dist/ directory so
    # that no files linger from previous builds.
    clean: ["dist/"]

    # Run the Stylus preprocessor to get vanilla CSS.
    stylus:
      development:
        options:
          use: [require("fluidity")]

        files:
          "dist/main.css": "styles/main.styl"

    # Minify the CSS for an optimal filesize.
    cssmin:
      release:
        files:
          "dist/main.min.css": [
            "styles/normalize"
            "dist/main.css"
          ]

    # Compress the built files for static GZip.
    zopfli:
      release:
        options:
          iterations: 50
          format: "zlib"

        files:
          "dist/main.min.css.gz": "dist/main.min.css"

  # Load external Grunt task plugins.
  @loadNpmTasks "grunt-express-server"
  @loadNpmTasks "grunt-contrib-watch"
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-cssmin"
  @loadNpmTasks "grunt-contrib-stylus"
  @loadNpmTasks "grunt-zopfli"

  # Default task.
  @registerTask "default", ["express", "stylus", "watch"]

  # Release task..
  @registerTask "release", ["clean", "stylus", "cssmin", "zopfli"]
