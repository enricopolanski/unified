// TODO: better types
export default (o: unknown): o is Buffer => {
  let u: any = o;
  return (
    u !== null &&
    u.constructor !== null &&
    typeof u.constructor.isBuffer === 'function' &&
    u.constructor.isBuffer(u)
  )
}