// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
export default function wrap(fn: Function, callback: Function) {
  let invoked: boolean = false

  return wrapped

  function wrapped() {
    var params = Array.from(arguments)
    var callback = fn.length > params.length
    var result

    if (callback) {
      params.push(done)
    }

    try {
      result = fn(...params)
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error
      }

      return done(error)
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  // Invoke `next`, only once.
  function done(...args: unknown[]) {
    if (!invoked) {
      invoked = true

      callback.apply(null, args)
    }
  }

  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value: null) {
    done(null, value)
  }
}
