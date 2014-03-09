module.exports = ->
  @loadNpmTasks "grunt-rsync"

  @config "rsync",
    options:
      src: "."
      host: "tbranyen.com"
      recursive: true
      syncDestIgnoreExcl: true

      exclude: [
        "/.git"
        "/node_modules"
        "/content"
      ]

    staging:
      options:
        dest: "/var/sites/tbranyen.com/subdomains/staging."

    production:
      options:
        dest: "/var/sites/tbranyen.com/www"
