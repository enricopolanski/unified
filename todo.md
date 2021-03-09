# TODO

## Odd check if this is a class

```js
if (newable(Parser, 'parse')) {
  return new Parser(String(file), file).parse()
}
```

Check if this can be rewritten.

## Look into overloads for functions like `data` in processor.