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

        tasks: ["express", "sass"]
        
        options:
          livereload: true

  # Load external Grunt task plugins.
  @loadNpmTasks "grunt-sass"
  @loadNpmTasks "grunt-express-server"
  @loadNpmTasks "grunt-contrib-watch"

  # Default task.
  @registerTask "default", ["express", "sass", "watch"]
