fs = require('fs')
Command = require('../Command')

class Init extends Command

  Init.DEFAULT_NAME = 'Example'
  Init.DEFAULT_HOST = 'example.com'

  process: (options = {}) ->
    if (!options.force and fs.existsSync(@config.file))
      @config.error('File ' + @config.file + ' already exists, use -f to rewrite it.')
      return false

    options.name ?= Init.DEFAULT_NAME
    options.host ?= Init.DEFAULT_HOST

    content =
      """
      HOST: http://#{options.host}/

      --- #{options.name} ---
      """

    fs.writeFileSync(@config.file, content)
    return content

module.exports = Init
