fs = require('fs')
mocco = require('mocco')
Init = require(process.cwd() + '/lib/CLI/Command/Init')

describe 'Command', () ->
  describe 'Init', () ->

    command = null
    mock = null

    beforeEach () ->
      command = new Init(file: 'apiary.apib', error: ()->)
      mock = mocco.mock(fs)
      mock.hijack 'writeFileSync', ()-> return true

    afterEach () ->
      mock.restore()

    it 'should create apiary.apib with default values when the file doesnt exist', () ->
      mock.hijack 'existsSync', ()-> return false
      content = command.process()
      content.should.include('HOST: http://' + Init.DEFAULT_HOST)
      content.should.include('-- ' + Init.DEFAULT_NAME + ' --')

    it 'should not create apiary.apib when the file exist', () ->
      mock.hijack 'existsSync', ()-> return true
      content = command.process()
      content.should.be.false

    it 'should create apiary.apib with options -f even when the file exist', () ->
      mock.hijack 'existsSync', ()-> return true
      content = command.process(force: true)
      content.should.not.be.true

    it 'should create apiary.apib with defined values', () ->
      mock.hijack 'existsSync', ()-> return false
      content = command.process(name: 'Apiary', host: 'apiary.io')
      content.should.include('HOST: http://apiary.io/')
      content.should.include('-- Apiary --')
