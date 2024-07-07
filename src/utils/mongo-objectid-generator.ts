export function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16) // 4-byte timestamp
  const machineId = '012345'.toString() // 3-byte machine identifier (replace with actual machine identifier)
  const processId = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, '0') // 2-byte process identifier
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0') // 3-byte counter

  return timestamp + machineId + processId + counter
}
