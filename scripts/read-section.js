import fs from 'fs'

const version = process.argv[3]
const buffer = fs.readFileSync(process.argv[2])

const Int = {
  read: (buf, off = 0) => buf.readInt32LE(off),
  write: (buf, v, off = 0) => buf.writeInt32LE(v, off),
  size: 0x04,
}
const Float = {
  read: (buf, off = 0) => buf.readFloatLE(off),
  write: (buf, v, off = 0) => buf.writeFloatLE(v, off),
  size: 0x04,
}

const strikeSchema = {
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
  func3: Int,
  param3: Float,
  func4: Int,
  param4: Float,
}
const strikeValues = Object.values(strikeSchema)
const BLOCK_SIZE = strikeValues.reduce((sum, v) => sum + v.size, 0)

const dominatorStrike = [
  84,
  275, 90,
  3, 3, 3, 0,
  10, 35, 15,
  0,
  0, 0,
  0, 0,
  0, 0,
  0, 0,
]

const ballisticSchema = {
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
}

const liberatorBallistics = [
  900,
  4.5,
  0.3,
  1.0,
]

function getRow(data, schema) {
  const values = Object.values(schema)
  const size = values.reduce((sum, v) => sum + v.size, 0)
  const buf = Buffer.alloc(size)
  let i = 0
  let offset = 0
  for(const { write: cb, size } of values) {
    const value = data[i] || 0
    cb(buf, value, offset)
    i++
    offset += size
  }
  return buf
}

function hex(v) {
  return `0x${v.toString(16).toUpperCase()}`
}

const domBytes = getRow(dominatorStrike, strikeSchema)
let idx = buffer.indexOf(domBytes.slice(strikeValues[0].size))
if(idx < 0) {
  throw new Error('Unable to locate Dominator Strike!')
}
idx -= 0x4
console.log(`Dominator located at: ${hex(idx)}`)
const dominatorId = buffer.readInt32LE(idx)
console.log(`Dominator ID: ${hex(dominatorId)}`)
idx -= (dominatorId - 1) * BLOCK_SIZE
console.log(`Strike Data starts at: ${hex(idx)}`)

let prevId = 0
const strikes = []
while(true) {
  const strike = {}
  for(const [prop, type] of Object.entries(strikeSchema)) {
    strike[prop] = type.read(buffer, idx)
    idx += type.size
  }
  if(strike.id) {
    strikes.push(strike)
    prevId = strike.id
  } else {
    break
  }
}

const libBytes = getRow(liberatorBallistics, ballisticSchema)
idx = buffer.indexOf(libBytes)
if(idx < 0) {
  throw new Error('Unable to locate 5.5mm ballstics!')
}
console.log(`5.5mm located at: ${hex(idx)}`)

const data = JSON.stringify({
  version,
  strikes,
}, null, 2)
fs.writeFileSync('./data/datamined.json', data)
