'use strict'

var test = require('tape')
var vfile = require('vfile')
var noop = require('./util/noop')
var unified = require('../dist')

test('stringify(node[, file])', function (t) {
  var processor = unified()
  var givenFile = vfile('charlie')
  var givenNode = {type: 'delta'}

  t.plan(16)

  t.throws(
    function () {
      processor.stringify('')
    },
    /Cannot `stringify` without `Compiler`/,
    'should throw without `Compiler`'
  )

  processor.Compiler = function (node, file) {
    t.equal(node, givenNode, 'should pass a node')
    t.ok('message' in file, 'should pass a file')
  }

  processor.Compiler.prototype.compile = function () {
    t.equal(arguments.length, 0, 'should not pass anything to `compile`')
    return 'echo'
  }

  t.equal(
    processor.stringify(givenNode, givenFile),
    'echo',
    'should return the result `Compiler#compile` returns'
  )

  processor.Compiler = function (node, file) {
    t.equal(node, givenNode, 'should pass a node')
    t.ok('message' in file, 'should pass a file')
    return 'echo'
  }

  t.equal(
    processor.stringify(givenNode, givenFile),
    'echo',
    'should return the result `compiler` returns if it’s not a constructor'
  )

  processor.Compiler = (node, file) => {
    t.equal(node, givenNode, 'should pass a node')
    t.ok('message' in file, 'should pass a file')
    return 'echo'
  }

  t.equal(
    processor.stringify(givenNode, givenFile),
    'echo',
    'should return the result `compiler` returns if it’s an arrow function'
  )

  processor.Compiler = function () {}

  t.throws(
    function () {
      processor.stringify()
    },
    /Expected node, got `undefined`/,
    'should throw without node'
  )

  class ESCompiler {
    constructor(node, file) {
      t.equal(node, givenNode, 'should pass a node')
      t.ok('message' in file, 'should pass a file')
    }

    compile() {
      t.equal(arguments.length, 0, 'should not pass anything to `compile`')
      return 'echo'
    }
  }

  processor.Compiler = ESCompiler

  t.equal(
    processor.stringify(givenNode, givenFile),
    'echo',
    'should return the result `Compiler#compile` returns on an ES class'
  )
})
