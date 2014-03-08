module.exports = ->
  @config "express",
    options:
      delay: 1
      script: "."
      port: 1987
      spawn: false
      background: true

    development:
      options:
        node_env: "development"

    production:
      options:
        node_env: "production"

  @loadNpmTasks "grunt-express-server"
