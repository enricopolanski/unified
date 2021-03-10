import isBuffer from './utils/isBuffer'
import isPlainObject from './utils/isPlainObject'
import trough from './utils/through'
import vfile, {VFile} from 'vfile'

interface ParserInterface {
  parse: () => unknown
}

interface ParserConstructor {
  new (doc: string, file: {message: unknown}): ParserInterface
}

interface ParserFunction {
  (doc: string, file: {message: unknown}): unknown
}

interface Node {
  type: string
}

interface CompilerFunction {
  (node: Node, file: string | VFile): string
}

interface CompilerInterface {
  compile: () => string
}

interface CompilerConstructor {
  new (node: Node, file: string | VFile): CompilerInterface
}

interface Processor {
  Parser: ParserConstructor | ParserFunction
  parse(doc: string | VFile): unknown
  Compiler: CompilerFunction | CompilerConstructor
  stringify(node: Node, doc: string | VFile): string
  run(
    node: Node,
    file: string | VFile | Function,
    cb?: Function
  ): unknown | void
}

// Process pipeline.
var pipeline = trough()
  .use(pipelineParse)
  .use(pipelineRun)
  .use(pipelineStringify)

function pipelineParse(
  processor: Processor,
  ctx: {file: string | VFile; tree: unknown}
) {
  ctx.tree = processor.parse(ctx.file)
}

function pipelineRun(
  p: Processor,
  ctx: {file: string | VFile; tree: Node},
  next: (error?: unknown) => void
) {
  p.run(ctx.tree, ctx.file, done)

  function done(error: unknown, tree: Node, file: string | VFile) {
    if (error) {
      next(error)
    } else {
      ctx.tree = tree
      ctx.file = file
      next()
    }
  }
}

function pipelineStringify(
  p: Processor,
  ctx: {file: string | VFile; tree: Node}
) {
  var result = p.stringify(ctx.tree, ctx.file)

  if (result === undefined || result === null) {
    // Empty.
  } else if (typeof result === 'string' || isBuffer(result)) {
    ctx.file.contents = result
  } else {
    ctx.file.result = result
  }
}

// Function to create the first processor.
function unified() {
  var attachers: unknown[] = []
  var transformers = trough()
  var namespace: Record<string, unknown> = {}
  var freezeIndex = -1
  var frozen: boolean = false

  // Data management.
  processor.data = data

  // Lock.
  processor.freeze = freeze

  // Plugins.
  processor.attachers = attachers
  processor.use = use

  // API.
  processor.parse = parse
  processor.stringify = stringify
  processor.run = run
  processor.runSync = runSync
  processor.process = process
  processor.processSync = processSync

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = unified()
    var index = -1

    while (++index < attachers.length) {
      destination.use.apply(null, attachers[index])
    }

    destination.data({...namespace})

    return destination
  }

  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values
    var transformer

    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex]

      if (values[1] === false) {
        continue
      }

      if (values[1] === true) {
        values[1] = undefined
      }

      transformer = values[0].apply(processor, values.slice(1))

      if (typeof transformer === 'function') {
        transformers.use(transformer)
      }
    }

    frozen = true
    freezeIndex = Infinity

    return processor
  }

  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen)
        namespace[key] = value
        return processor
      }

      // Get `key`.
      return namespace.hasOwnProperty(key) ? namespace[key] : null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen)
      namespace = key
      return processor
    }

    // Get space.
    return namespace
  }

  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  //     options).
  function use(value) {
    var settings

    assertUnfrozen('use', frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin.apply(null, arguments)
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = {...namespace.settings, ...settings}
    }

    return processor

    function addPreset(result) {
      addList(result.plugins)

      if (result.settings) {
        settings = {...settings, ...result.settings}
      }
    }

    function add(value: unknown) {
      if (typeof value === 'function') {
        addPlugin(value)
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value)
        } else {
          addPreset(value)
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }
    }

    function addList(plugins) {
      var index = -1

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (typeof plugins === 'object' && 'length' in plugins) {
        while (++index < plugins.length) {
          add(plugins[index])
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin)

      if (entry) {
        if (isPlainObject(entry[1]) && isPlainObject(value)) {
          value = {...entry[1], ...value}
        }

        entry[1] = value
      } else {
        attachers.push(Array.from(arguments))
      }
    }
  }

  function find(plugin) {
    var index = -1

    while (++index < attachers.length) {
      if (attachers[index][0] === plugin) {
        return attachers[index]
      }
    }
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc: string | VFile) {
    var file = vfile(doc)
    const Parser = ((processor as unknown) as Processor).Parser

    freeze()
    assertDesiredFunction('parse', Parser, 'Parser')

    if (isParserConstructor(Parser, 'parse')) {
      return new Parser(String(file), file).parse()
    }

    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node: Node, file: string | VFile | Function, cb?: Function) {
    assertNode(node)
    freeze()

    if (!cb && typeof file === 'function') {
      cb = file
      // file = null TODO: Leave here, doesn't break results commented but still
    }

    if (!cb) {
      return new Promise(executor)
    }

    function executor(resolve: Function | null, reject: Function) {
      transformers.run(node, vfile(file), done)

      function done(error: unknown, tree: Node, file: string | VFile) {
        tree = tree || node
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(tree)
        } else {
          cb(null, tree, file)
        }
      }
    }

    executor(null, cb)
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node: Node, file: string | VFile): Node {
    let result: Node = {type: 'DEBUG'}
    let complete = false

    run(node, file, done)

    assertDone('runSync', 'run', complete)

    return result

    // TODO: Possible tree: Node?
    function done(error: unknown, tree: Node) {
      if (error) {
        throw error
      }
      complete = true
      result = tree
    }
  }

  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node: Node, doc: string | VFile) {
    var file = vfile(doc)
    var Compiler = ((processor as unknown) as Processor).Compiler

    freeze()

    assertDesiredFunction('stringify', Compiler, 'Compiler')
    assertNode(node)

    if (isCompilerConstructor(Compiler, 'compile')) {
      return new Compiler(node, file).compile()
    }

    return Compiler(node, file) // eslint-disable-line new-cap
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc: string | VFile, cb: Function) {
    freeze()
    assertDesiredFunction(
      'process',
      ((processor as unknown) as Processor).Parser,
      'Parser'
    )
    assertDesiredFunction(
      'process',
      ((processor as unknown) as Processor).Compiler,
      'Compiler'
    )

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve: Function | null, reject: Function) {
      var file = vfile(doc)

      pipeline.run(processor, {file: file}, done)

      function done(error: unknown) {
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(file)
        } else {
          cb(null, file)
        }
      }
    }
  }

  // Process the given document (in string or vfile representation), sync.
  function processSync(doc: string | VFile) {
    const file = vfile(doc)
    let complete = false

    freeze()
    assertDesiredFunction(
      'processSync',
      ((processor as unknown) as Processor).Parser,
      'Parser'
    )
    assertDesiredFunction(
      'processSync',
      ((processor as unknown) as Processor).Compiler,
      'Compiler'
    )

    process(file, done)

    assertDone('processSync', 'process', complete)

    return file

    function done(error?: unknown) {
      complete = true
      if (error) {
        throw error
      }
    }
  }
}

function isParserConstructor(
  value: ParserFunction | ParserConstructor,
  name: string
): value is ParserConstructor {
  return newable(value, name)
}

function isCompilerConstructor(
  value: CompilerConstructor | CompilerFunction,
  name: string
): value is CompilerConstructor {
  return newable(value, name)
}

// Check if `value` is a constructor.
function newable(value: Function, name: string) {
  return (
    typeof value === 'function' &&
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    (hasKeys(value.prototype) || name in value.prototype)
  )
}

// Check if `value` is an object with keys.
function hasKeys(value: Record<string, unknown>): boolean {
  var key
  for (key in value) {
    return true
  }

  return false
}

// Assert a parser is available.
function assertDesiredFunction(
  name: string,
  maybeFunction: unknown,
  desiredFunction: string
) {
  if (typeof maybeFunction !== 'function') {
    throw new Error('Cannot `' + name + '` without `' + desiredFunction + '`')
  }
}

// Assert the processor is not frozen.
function assertUnfrozen(name: string, frozen: boolean) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
    )
  }
}

// Assert `node` is a unist node.
function assertNode(node?: Node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`')
  }
}

// Assert that `complete` is `true`.
function assertDone(name: string, asyncName: string, complete: boolean) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}

// Expose a frozen processor.
module.exports = unified().freeze()
