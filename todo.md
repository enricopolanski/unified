# TODO

## Odd check if this is a class

```js
if (newable(Parser, 'parse')) {
  return new Parser(String(file), file).parse()
}
```

Check if this can be rewritten.

## Look into overloads for functions like `data` in processor.

## Is tree a Node?

```ts
function pipelineParse(
  processor: Processor,
  ctx: {file: string | VFile; tree: unknown}
) {
  ctx.tree = processor.parse(ctx.file)
}

// with
interface Node {
  type: string
}
```
