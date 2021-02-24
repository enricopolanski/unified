'use strict'

var test = require('tape')
var simple = require('./util/simple')
var unified = require('../dist/')

test('freeze()', function (t) {
  var frozen = unified().use(config).freeze()
  var unfrozen = frozen()

  function config() {
    this.Parser = simple.Parser
    this.Compiler = simple.Compiler
  }

  t.doesNotThrow(function () {
    unfrozen.data()
  }, '`data` can be invoked on unfrozen interfaces')

  t.throws(
    function () {
      frozen.data('foo', 'bar')
    },
    /Cannot invoke `data` on a frozen processor/,
    '`data` cannot be invoked on frozen interfaces'
  )

  t.throws(
    function () {
      frozen.use()
    },
    /Cannot invoke `use` on a frozen processor/,
    '`use` cannot be invoked on frozen interfaces'
  )

  t.doesNotThrow(function () {
    frozen.parse()
  }, '`parse` can be invoked on frozen interfaces')

  t.doesNotThrow(function () {
    frozen.stringify({type: 'foo'})
  }, '`stringify` can be invoked on frozen interfaces')

  t.doesNotThrow(function () {
    frozen.runSync({type: 'foo'})
  }, '`runSync` can be invoked on frozen interfaces')

  t.doesNotThrow(function () {
    frozen.run({type: 'foo'}, function () {})
  }, '`run` can be invoked on frozen interfaces')

  t.doesNotThrow(function () {
    frozen.processSync('')
  }, '`processSync` can be invoked on frozen interfaces')

  t.doesNotThrow(function () {
    frozen.process('', function () {})
  }, '`process` can be invoked on frozen interfaces')

  t.test('should freeze once, even for nested calls', function (t) {
    t.plan(2)

    var index = 0
    var processor = unified()
      .use(plugin)
      .use({plugins: [freezingPlugin]})
      .use({plugins: [freezingPlugin]})
      .freeze()

    processor().freeze()

    function plugin() {
      t.pass('Expected: ' + String(index++))
    }

    function freezingPlugin() {
      this.freeze()
    }
  })

  t.end()
})
