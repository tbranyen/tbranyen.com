module.exports = ->
  @loadNpmTasks "grunt-express-server"

  @config "express",
    options:
      delay: 1
      script: "."
      port: 1987
      spawn: false
      background: true

    development:
      options:
        node_env: "test"

    production:
      options:
        node_env: "production"
