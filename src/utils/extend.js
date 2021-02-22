'use strict'

var hasOwn = Object.prototype.hasOwnProperty
var toString_ = Object.prototype.toString
var defineProperty = Object.defineProperty
var gOPD = Object.getOwnPropertyDescriptor

var isArray = function isArray(array) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(array)
  }

  return toString_.call(array) === '[object Array]'
}

var isPlainObject = require('./isPlainObject')

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
  if (defineProperty && options.name === '__proto__') {
    defineProperty(target, options.name, {
      enumerable: true,
      configurable: true,
      value: options.newValue,
      writable: true
    })
  } else {
    target[options.name] = options.newValue
  }
}

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(object, name) {
  if (name === '__proto__') {
    if (!hasOwn.call(object, name)) {
      return void 0
    }

    if (gOPD) {
      // In early versions of node, obj['__proto__'] is buggy when obj has
      // __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
      return gOPD(object, name).value
    }
  }

  return object[name]
}

function extend () {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0]
  var i = 1
  var length = arguments.length
  var deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {}
    // Skip the boolean and the target
    i = 2
  }

  if (
    target == null ||
    (typeof target !== 'object' && typeof target !== 'function')
  ) {
    target = {}
  }

  for (; i < length; ++i) {
    options = arguments[i]
    // Only deal with non-null/undefined values
    if (options != null) {
      // Extend the base object
      for (name in options) {
        src = getProperty(target, name)
        copy = getProperty(options, name)

        // Prevent never-ending loop
        if (target !== copy) {
          // Recurse if we're merging plain objects or arrays
          if (
            deep &&
            copy &&
            (isPlainObject(copy) || (copyIsArray = isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false
              clone = src && isArray(src) ? src : []
            } else {
              clone = src && isPlainObject(src) ? src : {}
            }

            // Never move original objects, clone them
            setProperty(target, {
              name: name,
              newValue: extend(deep, clone, copy)
            })

            // Don't bring in undefined values
          } else if (typeof copy !== 'undefined') {
            setProperty(target, {name: name, newValue: copy})
          }
        }
      }
    }
  }

  // Return the modified object
  return target
}

module.exports = extend