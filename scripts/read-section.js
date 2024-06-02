import fs from 'fs'
import json from 'json-stringify-pretty-compact'

let debugUnknown = false
let outputRaw = false

const buffer = fs.readFileSync(process.argv[2])
const enumBuffer = fs.readFileSync(process.argv[3])
const version = process.argv[4]

function hex(v) {
  return `0x${v.toString(16).toUpperCase()}`
}

function searchWords({
  buffer,
  first,
  last,
}) {
  let idx = buffer.indexOf(first)
  console.log(`First word "${first}" at: ${hex(idx)}`)
  if(idx < 0) {
    throw new Error(`Couldn't find: ${first}`)
  }
  let word
  const words = []
  let i = 0
  while(word !== last) {
    let nextIdx = buffer.indexOf('\0', idx)
    word = buffer.toString('ascii', idx, nextIdx)
    words.push(word)
    idx = nextIdx + 1
    i++;
  }
  console.log(`Found ${words.length} words`)
  return words
}

function writeEnums(path, arr) {
  const joined = arr.map((str, i) => {
    return `    ${str} = ${hex(i)},`
  }).join('\n')
  fs.writeFileSync(path, `{\n${joined}\n}`)
}

const damageEnums = searchWords({
  buffer: enumBuffer,
  first: 'DamageInfoType_None',
  last: 'DamageInfoType',
})
// writeEnums('data/damage-info-types.cs', damageEnums)

const projectileEnums = searchWords({
  buffer: enumBuffer,
  first: 'ProjectileType_None',
  last: 'ProjectileType',
})
// writeEnums('data/projectile-types.cs', projectileEnums)

const explosionEnums = searchWords({
  buffer: enumBuffer,
  first: 'ExplosionType_None',
  last: 'ExplosionType',
})
// writeEnums('data/explosion-types.cs', explosionEnums)

const abilityEnums = searchWords({
  buffer: enumBuffer,
  first: 'AbilityId_Invalid',
  last: 'AbilityId',
})
// writeEnums('data/explosion-types.cs', explosionEnums)

const Int = {
  read: (buf, off = 0) => buf.readInt32LE(off),
  write: (buf, v, off = 0) => buf.writeInt32LE(v, off),
  size: 0x04,
}
const Float = {
  read: (buf, off = 0) => +buf.readFloatLE(off).toFixed(3),
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
    if(debugUnknown && int === 0) {
      return void 0
    }
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

const damageSearch = {
  dmg: Int,
  dmg2: Int,
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
const damageSchema = {
  id: Int,
  ...damageSearch,
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
  enums: enumsRaw,
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

  const enums = enumsRaw.map(e => {
    return e.split('_').slice(cutPrefix).join('_')
  })

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

const damages = readData({
  buffer,
  searchSchema: damageSearch,
  searchData: dominatorDamage,
  searchName: 'Dominator Damage',
  searchOffset: 0x4,
  enums: damageEnums,
  schema: damageSchema,
})

function unknowns(from, to, overrides = {}) {
  const obj = {}
  for(let i = from; i <= to; i++) {
    obj[`unk${i}`] = overrides[i] || Unknown
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
  ...unknowns(13, 13, { 13: Int }),
  lifetime: Float,
  ...unknowns(15, 15, {}),
  damageid: Int,
  penslow: Float,
  ...unknowns(18, 60, {
    35: Float,
    38: Float,
    39: Int,
    42: Int,
    43: Int,
    44: Int,
    45: Float,
    46: Float,
    47: Float,
    48: Float,
    49: Float,
    55: Int,
    57: Int,
  }),
}

const projectiles = readData({
  buffer,
  searchSchema: projectileSearchSchema,
  searchData: liberatorFMJ,
  searchName: '5.5x50mm Full Metal Jacket',
  searchOffset: 0x18,
  enums: projectileEnums,
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
  enums: explosionEnums,
  schema: explosionSchema,
})

const data = json({
  version,
  damages,
  projectiles,
  explosions,
})

fs.writeFileSync('./data/datamined.json', data)
