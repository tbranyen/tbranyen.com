module.exports = ->
  @loadNpmTasks "grunt-express-server"

  @config "express",
    options:
      delay: 1
      script: "."
      port: process.env.PORT || 1987

    development:
      options:
        node_env: "test"

    production:
      options:
        node_env: "production"
