import fs from 'fs'
import clipboard from 'clipboardy'
import { getRefRegister } from './ref-register.js'

const { weapons } = JSON.parse(fs.readFileSync('data/weapons.json'))
const data = getRefRegister()

let target = null
let targetIdx = null
let args = process.argv.slice(2)
if(['arc', 'beam', 'projectile', 'explosion', 'damage'].includes(args[0])) {
  target = args[0]
  args = args.slice(1)
}
if(!isNaN(args[0])) {
  targetIdx = +args[0]
  args = args.slice(1)
}
const search = new RegExp(args[0], 'i')
const wpn = weapons
  .find(wpn => wpn.attack?.length && search.exec(wpn.fullname))
if(!wpn) {
  throw new Error(`No results: ${search}`)
}
console.log(`Weapon located: "${wpn.fullname}"`)
for(const override of args.slice(1)) {
  const [prop, value] = override.split('=')
  wpn[prop] = +value
}

function Int(buffer, value, offset = 0) {
  return buffer.writeInt32LE(value, offset)
}
function Float(buffer, value, offset = 0) {
  return buffer.writeFloatLE(value, offset)
}

const damageSchema = Object.entries({
  id: Int,
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
})
const projectileSchema = Object.entries({
  caliber: Float,
  pellets: Int,
  velocity: Float,
  mass: Float,
  drag: Float,
  gravity: Float,
})
const explosionSchema = Object.entries({
  r1: Float,
  r2: Float,
  r3: Float,
})
const beamSchema = Object.entries({
  range: Float,
  damageid: Int,
})
const arcSchema = Object.entries({
  id: Int,
  velocity: Float,
  range: Float,
  unk4: Float,
  unk5: Float,
  chainangle: Float,
  aimangle: Float,
  unk8: Int,
})
const schemas = {
  damage: damageSchema,
  projectile: projectileSchema,
  explosion: explosionSchema,
  beam: beamSchema,
  arc: arcSchema,
}
let attack = wpn.attack[0]
if(targetIdx > 0) {
  attack = wpn.attack[targetIdx]
} else if(target) {
  attack = wpn.attack.find(atk => atk.type === target)
}
if(!attack) {
  throw new Error(`No attack found: ${target || 'any'}/${targetIdx || 'any'}`)
}

let schema = schemas[target || 'damage']
let medium = data[attack.type][attack.name]
if(attack.type !== 'damage' && !target) {
  if(medium.damageref) {
    medium = data.damage[medium.damageref]
    if(!medium) {
      throw new Error(`Damage not found: ${medium.damageref}`)
    }
  } else {
    console.log(`Damage not found, defaulting to ${attack.medium} data`)
    schema = schemas[attack.type]
  }
} else if(attack.type !== target && target === 'damage') {
  medium = data.damage[medium.damageref]
  if(!medium) {
    throw new Error(`Damage not found: ${medium.damageref}`)
  }
} else if(attack.type !== 'damage') {
  schema = schemas[attack.type]
}
if(!medium) {
  throw new Error('Target not found')
}

const buf = Buffer.alloc(0x4 * schema.length)
for(let i = 0; i < schema.length; i++) {
  const offset = i * 0x4
  const [prop, cb] = schema[i]
  cb(buf, medium[prop] || 0, offset)
}
function hex(v) {
  return `0x${v.toString(16)}`
}
console.log(`Object: "${medium.enum}" (${target || 'damage'}) (id: ${hex(medium.id)})`)
const str = Array.from(buf).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
console.log(str)
clipboard.writeSync(str)
