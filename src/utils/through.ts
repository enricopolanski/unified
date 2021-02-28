import wrap from './wrap'

module.exports = trough

trough.wrap = wrap

var slice = [].slice

// Create new middleware.
function trough() {
  var fns: Function[] = []
  var middleware = {
    run,
    use
  }
  
  // Run `fns`.  Last argument must be a completion handler.
  function run(...args: unknown[]) {
    let index = -1
    // all but last arguments
    let input: unknown[] = slice.call(args, 0, -1)
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
      var params = [...arguments]
      // tail
      var values = params.slice(1)
      var length = input.length
      var pos = -1
      
      
      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos]
        }
      }
      
      input = values
      
      // Next or done.
      if (fn) {
        wrap(fn, next).apply(null, input as any)
      } else {
        done.apply(null, [null, ...input])
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
