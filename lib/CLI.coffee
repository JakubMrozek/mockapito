program = require('commander')
path = require('path')

Command = []
Command.Init = require('../lib/CLI/Command/Init')


module.exports = (config) ->
  config.file ?= process.cwd() + path.sep + 'apiary.apib'
  config.error = console.error

  init = new Command.Init(config)
  program
    .command('init')
    .description('creates a new apiary.apib file')
    .option('-f --force', 'overwrite the apairy.apib file')
    .option('-n --name [name]', 'sets the project name')
    .option('-h --host [host]', "sets the project host")
    .action(init.process.bind(init))

  program.usage('[options]')
