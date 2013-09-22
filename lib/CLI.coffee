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
    .option('-f --force', 'rewrite file apairy.apib')
    .option('-n --name [name]', 'project name')
    .option('-h --host [host]', "project host")
    .action(init.process.bind(init))

  program.usage('[options]')
