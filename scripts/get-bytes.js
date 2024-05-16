import fs from 'fs'
import clipboard from 'clipboardy'

const weapons = JSON.parse(fs.readFileSync('./data/weapons.json', 'utf-8').trim())

let xMode = false
let args = process.argv.slice(2)
if(args[0] === 'x') {
  xMode = true
  args = args.slice(1)
}
const search = new RegExp(args[0], 'i')
const wpn = weapons.find(wpn => search.exec(wpn.fullname))
if(!wpn) {
  throw new Error(`No results: ${search}`)
}
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

const schema = Object.entries({
  id: Int,
  damage: Int,
  durable: Int,
  ap: Int,
  ap2: Int,
  ap3: Int,
  ap4: Int,
  demo: Int,
  stun: Int,
  push: Int,
  dmgtype: Int,
  effect1: Int,
  param1: Float,
  effect2: Int,
  param2: Float,
})
const xschema = Object.entries({
  xid: Int,
  xdamage: Int,
  xdurable: Int,
  xap: Int,
  xap2: Int,
  xap3: Int,
  xap4: Int,
  xdemo: Int,
  xstun: Int,
  xpush: Int,
  dmgtype: Int,
  effect1: Int,
  param1: Float,
  effect2: Int,
  param2: Float,
})

const useschema = xMode ? xschema : schema
const buf = Buffer.alloc(0x4c)
for(let i = 0; i < schema.length; i++) {
  const offset = i * 0x4
  const [prop, cb] = useschema[i]
  Int(buf, wpn[prop] || 0, offset)
}
const str = Array.from(buf).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
console.log(str)
clipboard.writeSync(str)
