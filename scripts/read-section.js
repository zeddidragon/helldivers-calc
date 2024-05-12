import fs from 'fs'

const version = process.argv[3]
const buffer = fs.readFileSync(process.argv[2])

function Int(buffer, offset = 0) {
  return buffer.readInt32LE(offset)
}
function Float(buffer, offset = 0) {
  return buffer.readFloatLE(offset)
}
const schema = {
  id: Int,
  dmg: Int,
  mass: Int,
  ap1: Int,
  ap2: Int,
  ap3: Int,
  ap4: Int,
  demo: Int,
  stun: Int,
  push: Int,
  type: Int,
  func1: Int,
  param1: Float,
  func2: Int,
  param2: Float,
}
const valueSize = 0x4
function readWeapon(buffer) {
  const obj = {}
  let offset = 0
  for(const [k, cb] of Object.entries(schema)) {
    obj[k] = cb(buffer, offset)
    offset += valueSize
  }
  return obj
}

const start = 0x64
const pageSize = 0x4c
const strikes = []
for(let i = start; i < buffer.length; i += pageSize) {
  const page = buffer.slice(i, i + pageSize)
  const strike = readWeapon(page)
  if(strike.id) {
    strikes.push(strike)
  } else {
    break
  }
}

const data = JSON.stringify({
  version,
  strikes,
}, null, 2)
fs.writeFileSync('./data/datamined.json', data)
