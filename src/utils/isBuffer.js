module.exports = function (object) {
  return (
    object !== null &&
    object.constructor !== null &&
    typeof object.constructor.isBuffer === 'function' &&
    object.constructor.isBuffer(object)
  )
}
