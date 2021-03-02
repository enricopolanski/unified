# Refactor of `extend`

## Purpose

The purpose of `extend` is to `extend` one object with one or more others, returning the extended object.

## Current API

`extend([target], target, object1, [objectN])`

### Arguments

- `deep`: boolean (optional) If set, the merge becomes recursive (e.g. deep copy).
  
- `target`: Object. The object to extend.

- `object1`: Object. The object that will be merged into the first.

- `objectN`: Object (optional). More objects to merge into the first.

## Goals of the rewrite

### Understand how and where `extend` is used in the unified codebase

#### First instance

```ts
// index.ts L81
destination.data(extend(true, {}, namespace))
```

It seems that when the `processor` is created the `namespace` (what is that?) gets merged with `data` on `destination`. "destination" seems to be a name for a processor.

#### Second instance

```ts
// index.ts L178
namespace.settings = extend(namespace.settings || {}, settings)
```

It seems that some `namespace.settings` get merged with some other `settings`.

#### Third instance

```ts
// index.ts L187
settings = extend(settings || {}, result.settings)
```

It seems that some `settings` get merged with some other `result.settings`.

#### Forth instance

```ts
// index.ts L224
value = extend(entry[1], value)
```

It seems that some `value` gets assigned to the merged value of `entry[1]` and the `value` itself.

## Analyse how could the API be adapted to our needs

TODO: In progress.

### Approach 1: remove extend completely in favor of spread operator

#### First instance refactor

Rewriting

```ts
// index.ts L81
destination.data(extend(true, {}, namespace))
```

as

```ts
// index.ts L81
destination.data(namespace)
```

Fails the tests.

```ts
// index.ts L81
destination.data({...namespace})
```

does not.

#### Second instance refactor

```ts
// index.ts L178
namespace.settings = extend(namespace.settings || {}, settings)
```

#### Third instance refactor

```ts
// index.ts L187
settings = extend(settings || {}, result.settings)
```

to

```ts
namespace.settings = {...namespace.settings, ...settings}
```

#### Forth instance refactor

```ts
// index.ts L224
value = {...entry[1], ...value}
```

### Change the API

Not required, we leveraged the `spread operator` instead of the extend function.

### Type the API

Same as above.

### Final changes summary

Removed the `extend` plugin completely.

Completed in commit: 2d9c5d84216b69380fd197e7239ed1b3cee6a988.
