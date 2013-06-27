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
          "client/assets/css/main.css": "client/scss/main.scss"

    express:
      options:
        background: true

      development:
        options:
          script: "server/lib/site.js"

  # Load external Grunt task plugins.
  @loadNpmTasks "grunt-sass"
  @loadNpmTasks "grunt-express-server"

  # Default task.
  @registerTask "default", ["sass", "express"]
