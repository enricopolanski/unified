# Understanding and typing the  `Parser`

## Purpose

The `Parser` is the part of the `processor` that deals with transforming a string (or a file?) into an abstract syntax tree.

## Goals

### Understand how the Parser works and is used by the library

The first mention of the parser happens in the `parse` function in `index.ts`.

```ts
function parse(doc) {
  var file = vfile(doc)
  var Parser

  freeze()
  Parser = processor.Parser
  assertParser('parse', Parser)

  if (newable(Parser, 'parse')) {
    return new Parser(String(file), file).parse()
  }

  return Parser(String(file), file) // eslint-disable-line new-cap
}
```

```ts
function unified() {
  
  processor.parse = parse

  return processor
  // Create a new processor based on the processor in the current scope.
  function processor() {
    // stuff
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    // our previous `parse`
  }
}
```

1) The `parse` function is a method returned by the `unified()` function:

2) This function takes a `doc` (?, what is a doc?).

3) The `doc` gets passed to the `vfile` function, we should investigate what this `vfile` function does later.

4) then there is a call to `freeze()`. Apparently the `freeze()` function defined on the `processor` in the same way `parse` was.

5) then a local variable `Parser` is assigned the `processor.Parser` value.

6) then the `Parser` is asserted.

7) Last, the `Parser` gets passed a string representation of the file and the vfile one.

8) There seems to be two types of `Parser` handled by the lib. Either a class based or a function based.

### Understand how the Parser is used in the tests

In `test/parse.js` there are 15 assertions.

1) Tests if executing `processor.parse('')` throws via `assertParser` defined on `index.ts`.

2) Tests whether the `Parser` added on the `processor` takes a `doc: string` as first argument.

3) Tests whether the `Parser` added on the `processor` takes a `file: {message: unknown}` as second argument.

4) Tests whether the `parse` function added on `processor.Parser.prototype.parse` takes no arguments.

5) Tests whether `processor.parse('charlie')` returns `givenNode` which is a static value: `var givenNode = {type: 'delta'}`.

6) Reassigns `Parser` on `processor` and repeats 2.

7) Repeats 3 on the parser assigned in 6. This time the function also returns `givenNode`, before it didn't return anything.

8) Since this time the test expects the `Parser` to not be a constructor, it expects that calling `processor.parse('charlie')` returns `givenNode` which is a static value: `var givenNode = {type: 'delta'}`.

9) Repeats the `doc: string` test, this time it assigns to `Parser` an arrow function.

10) Repeats the `message in file` test with the aforementioned `Parser` arrow function.

11) Repeats the `processor.parse('charlie')` test returning the `givenNode` value for the arrow function.

12) Creates the Parser as an es6 class called `ESParser`. Tests `doc: string` in the constructor.

13) Tests `message in file` for the second constructor argument.

14) Tests whether the `parse` method on the `ESParser` takes no argument.

15) Tests whether the `parse` method on the `ESParser` class returns `givenNode` when applied to `charlie`.

Takeaways:

- the Parser has to be a function, either a constructor or one that has a `parse` method on its prototype

- `doc` should always be a `string`

- `file` should always be a Record with at least a `message`, it's hard to understand what type this field has to be

- `processor.Parser.parse` is different than `processor.parse`. The first doesn't expect any arguments. The second expects at least a string? (TBF)

### Type the Parser

TODO: TBS
