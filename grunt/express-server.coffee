module.exports = ->
  @config "express",
    options:
      delay: 1
      script: "."
      port: 1987

    development:
      options:
        node_env: "development"
        spawn: false

  @loadNpmTasks "grunt-express-server"
