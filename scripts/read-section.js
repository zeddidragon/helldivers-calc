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
const Unknown = {
  read: (buf, off = 0) => {
    const float = buf.readFloatLE(off)
    const int = buf.readInt32LE(off)
    const hex = buf.slice(off, off + 0x8)
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
    return void 0
  },
  write: (buf, v, off = 0) => {
    throw Error('Write not implemented')
  },
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
const STRIKE_SIZE = strikeValues.reduce((sum, v) => sum + v.size, 0)

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

const ballisticSearchSchema = {
  caliber: Float,
  i1: Int,
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
}

const liberatorBallistics = [
  5.5,
  1,
  900,
  4.5,
  0.3,
  1.0,
  0,
  0.25,
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

function rewind(buffer, idx, blockSize) {
  while(buffer.readInt32LE(idx - blockSize)) {
    idx -= blockSize
  }
  return idx
}

const domBytes = getRow(dominatorStrike, strikeSchema)
let idx = buffer.indexOf(domBytes.slice(strikeValues[0].size))
if(idx < 0) {
  throw new Error('Unable to locate Dominator Strike!')
}
idx -= 0x4 // Hop back to ID
console.log(`Dominator located at: ${hex(idx)}`)
const dominatorId = Int.read(buffer, idx)
console.log(`Dominator ID: ${hex(dominatorId)}`)
idx = rewind(buffer, idx, STRIKE_SIZE) // Walk back to first row
console.log(`Strike Data starts at: ${hex(idx)}`)

const strikes = []
while(true) {
  const strike = {}
  for(const [prop, type] of Object.entries(strikeSchema)) {
    strike[prop] = type.read(buffer, idx)
    idx += type.size
  }
  if(strike.id) {
    strikes.push(strike)
  } else {
    break
  }
}

const BALLISTIC_SIZE = 0xf0
const libBytes = getRow(liberatorBallistics, ballisticSearchSchema)
console.log(libBytes)
idx = buffer.indexOf(libBytes)
if(idx < 0) {
  throw new Error('Unable to locate 5.5mm ballistics!')
}
console.log(`5.5mm located at: ${hex(idx)}`)
idx += 0x24 - BALLISTIC_SIZE // Hop back to ID
const libId = Int.read(buffer, idx)
console.log(`5.5mm ID: ${hex(libId)}`)
idx = rewind(buffer, idx, BALLISTIC_SIZE)
console.log(`Ballistics Data starts at: ${hex(idx)}`)

function unknowns(from, to) {
  const obj = {}
  for(let i = from; i <= to; i++) {
    obj[`unk${i}`] = Unknown
  }
  return obj
}

const ballisticSchema = {
  id: Int,
  ...unknowns(2, 51),
  caliber: Float,
  unk53: Int,
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
  ...unknowns(58, 60)
}

const ballistics = []
while(true) {
  const obj = {}
  for(const [prop, type] of Object.entries(ballisticSchema)) {
    obj[prop] = type.read(buffer, idx)
    idx += type.size
  }
  if(obj.id) {
    ballistics.push(obj)
  } else {
    break
  }
}

const data = JSON.stringify({
  version,
  strikes,
  ballistics,
}, null, 2)
fs.writeFileSync('./data/datamined.json', data)
