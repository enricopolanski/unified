# Understanding and typing the `stringify` and `Compiler`

## Purpose

The `Compiler` is the part of the `processor` that deals with transforming the abstract syntax tree into a string.

## Goals

### Understand how the Compiler works and is used by the library

The first mention of the `Compiler` is inside the `stringify` function in the processor's body.

```ts
function stringify(node, doc: string | VFile) {
  var file = vfile(doc)
  var Compiler

  freeze()
  Compiler = processor.Compiler
  assertCompiler('stringify', Compiler)
  assertNode(node)

  if (newable(Compiler, 'compile')) {
    return new Compiler(node, file).compile()
  }

  return Compiler(node, file) // eslint-disable-line new-cap
}
```

`stringify` is a method to attached to the processor returned by the `unified` function:

```ts
function unified(): Processor {
  processor.stringify = stringify

  return processor

    // Create a new processor based on the processor in the current scope.
  function processor() {
  }

  function stringify(node, doc: string | VFile) {
  }
```

Thus:

1) `stringify` is a method returned attached to the value returned by the `unified()` function.

2) This function takes a `node` (?, what is a node?).

3) This function takes a `doc` as second parameter of type `string` or `VFile`.

4) A local `file` variable is assigned the value of `vfile(doc)`.

5) A scoped Parser variable is bound to the value of `processor.Parser`.

6) The function calls a `freeze` method.

7) Asserts that the local `Compiler` variable value is a `Compiler`.
  
8) Asserts the passed `node` is a node, whatever it means.

9) Checks whether Compiler is a constructor or a function, like for Parser.

### Understand how the Parser is used in the tests.

1) Tests if calling `processor.stringify('')` throws an error.

2) tests whether the `node` argument passed to the `Compiler` function assigned to `processor` equals `{ type: 'delta' }`.

3) Tests whether the `file` value passed as second argument to the same function above contains a `message` propriety.

4) Tests whether the `compile` function on `processor.Compiler.prototype` is called with 0 arguments.

5) Tests whether calling `processor.stringify(givenNode, givenFile)` returns `"echo"`, an hardcoded value.

6, 7, 8) Reassigns `processor.Compiler` which this time returns a value (was it used in constructor mode before?) and tests again 2) and 3) for this implementation.

9, 10, 11) tests the same as 6,7,8  before but this time using an arrow function

12) Reassigns `Compiler` to `function(){}` and tests as before.

13, 14, 15, 16) Reassigns `Compiler` to a `class` implementation and tests as before.

Takeaways:

- Notes, calling `vfile('charlie')` in tests returns:

```ts
VFile {
  data: {},
  messages: [],
  history: [],
  cwd: '/home/enrico/dev/bench/unified',
  contents: 'charlie'
}
```

- the value before has a `message` in it.

### Type the Compiler

```ts
interface CompilerInterface {
  compile: ()=> string
}

interface CompilerFunction {
  (node: { type: string }, file: string | Vfile): string
}

interface CompilerConstructor {
  new (node: { type: string }, file: string | Vfile): CompilerInterface
}
```

