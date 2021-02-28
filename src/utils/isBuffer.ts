export default function isBuffer(object: unknown): object is Buffer {
  return (
    object instanceof Buffer
  )
}
