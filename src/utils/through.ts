import wrap from './wrap'

// Create new middleware.
export default function through() {
  var fns: Function[] = []
  var middleware = {
    run,
    use
  }

  // Run `fns`.  Last argument must be a completion handler.
  function run(...args: unknown[]) {
    let index = -1
    // all but last arguments
    let input: unknown[] = [].slice.call(args, 0, -1)
    // last
    var done: Function = args[args.length - 1] as Function

    next.apply(null, [null, ...input])

    // Run the next `fn`, if any.
    function next(err: unknown | null, ...rest: unknown[]) {
      if (err) {
        done(err)
        return
      }
      var fn = fns[++index]
      // tail
      var values = rest
      var length = input.length
      var pos = -1

      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos]
        }
      }

      // Next or done.
      if (fn) {
        wrap(fn, next).apply(null, values as any)
      } else {
        done.apply(null, [null, ...values])
      }
    }
  }

  // Add `fn` to the list.
  function use(fn: Function) {
    fns.push(fn)

    return middleware
  }

  return middleware
}
