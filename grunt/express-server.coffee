module.exports = ->
  @config "express",
    options:
      background: true
      delay: 1
      script: "."
      port: 1987

    development:
      options:
        node_env: "development"

  @loadNpmTasks "grunt-express-server"
