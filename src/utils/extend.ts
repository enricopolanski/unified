import { isPlainObject } from './isPlainObject'

function isArray(u: unknown) {
    return Array.isArray(u)
}

function setProperty(target: Record<string, unknown>, options: {name: string, newValue: unknown}) {
    target[options.name] = options.newValue
}

const getProperty = (object: Record<string, unknown>, name: string) => object[name]

export function extend () {
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