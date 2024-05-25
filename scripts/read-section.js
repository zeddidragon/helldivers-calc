import fs from 'fs'
import json from 'json-stringify-pretty-compact'

let debugUnknown = false
let outputRaw = false

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
    let hex = Array.from(buf.slice(off, off + 0x4))
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
    hex = `0x${hex}`
    if(debugUnknown) {
      return { float, int, hex }
    }
    return void 0
  },
  write: (buf, v, off = 0) => {
    throw Error('Write not implemented')
  },
  size: 0x04,
}

function hexString(buf) {
  return Array.from(buf).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
}

const strikeSearch = {
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
const strikeSchema = {
  id: Int,
  ...strikeSearch,
}

const dominatorDamage = [
  275, 90,
  3, 3, 3, 0,
  10, 35, 15,
  0,
  0, 0,
  0, 0,
  0, 0,
  0, 0,
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

function isId(v) {
  if(!v) return false
  if(v < 0) return false
  if(v > 10000) return false
  return true
}

function rewind(buffer, idx, blockSize) {
  while(isId(buffer.readInt32LE(idx - blockSize))) {
    idx -= blockSize
  }
  return idx
}

function readData({
  searchSchema,
  searchData,
  searchName = 'search data',
  searchOffset = 0,
  buffer,
  enumFileName,
  schema,
  cutPrefix = 1,
}) {
  const bytes = getRow(searchData, searchSchema)
  console.log(bytes)
  let idx = buffer.indexOf(bytes)
  if(idx < 0) {
    throw new Error(`Unable to locate ${searchName}!`)
  }

  idx -= searchOffset // Hop back to ID
  console.log(`${searchName} located at: ${hex(idx)}`)
  const searchId = Int.read(buffer, idx)
  console.log(`${searchName} ID: ${hex(searchId)}`)
  const size = Object.values(schema).reduce((sum, v) => sum + v.size, 0)
  idx = rewind(buffer, idx, size) // Walk back to first row
  console.log(`Data starts at: ${hex(idx)}`)

  const enums = {}
  const enumsFile = fs.readFileSync(`./data/${enumFileName}.cs`, 'utf8')
  const pattern  = /(\w+) = 0x([0-9A-F]+)/
  for(const line of enumsFile.split('\n')) {
    const [, name, id] = pattern.exec(line) || []
    if(!name) continue
    enums[parseInt(id, 16)] = name.split('_').slice(cutPrefix).join('_')
  }

  const objects = []
  while(true) {
    const obj = {}
    const start = idx
    for(const [prop, type] of Object.entries(schema)) {
      obj[prop] = type.read(buffer, idx)
      idx += type.size
    }
    if(outputRaw) {
      obj.raw = hexString(buffer.slice(start, idx))
    }
    obj.enum = enums[obj.id]
    if(isId(obj.id)) {
      objects.push(obj)
    } else {
      break
    }
  }
  return objects
}

const strikes = readData({
  buffer,
  searchSchema: strikeSearch,
  searchData: dominatorDamage,
  searchName: 'Dominator Damage',
  searchOffset: 0x4,
  enumFileName: 'damage-info-types',
  schema: strikeSchema,
})

function unknowns(from, to) {
  const obj = {}
  for(let i = from; i <= to; i++) {
    obj[`unk${i}`] = Unknown
  }
  return obj
}

const projectileSearchSchema = {
  caliber: Float,
  i1: Int,
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
}

const liberatorFMJ = [
  5.5,
  1,
  900,
  4.5,
  0.3,
  1.0,
  0,
  0.25,
]

const projectileSchema = {
  id: Int,
  ...unknowns(2, 6),
  caliber: Float,
  pellets: Int,
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
  ...unknowns(13, 15),
  damageid: Int,
  penslow: Float,
  ...unknowns(18, 60),
}

const projectiles = readData({
  buffer,
  searchSchema: projectileSearchSchema,
  searchData: liberatorFMJ,
  searchName: '5.5x50mm Full Metal Jacket',
  searchOffset: 0x18,
  enumFileName: 'projectile-types',
  schema: projectileSchema,
})

const explosionSearchSchema = {
  r1: Float,
  r2: Float,
  r3: Float,
}

const eagle500kgBomb = [
  6.7,
  20,
  30,
]


const explosionSchema = {
  id: Int,
  damageid: Int,
  ...unknowns(3, 3),
  r1: Float,
  r2: Float,
  r3: Float,
  ...unknowns(7, 28),
}

const explosions = readData({
  buffer,
  searchSchema: explosionSearchSchema,
  searchData: eagle500kgBomb,
  searchName: 'Eagle 500kg Bomb',
  searchOffset: 0xc,
  enumFileName: 'explosion-types',
  schema: explosionSchema,
  cutPrefix: 0,
})

const data = json({
  version,
  strikes,
  projectiles,
  explosions,
})
fs.writeFileSync('./data/datamined.json', data)
