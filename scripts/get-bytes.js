import fs from 'fs'

const weapons = JSON.parse(fs.readFileSync('./data/weapons.json', 'utf-8').trim())

const search = new RegExp(process.argv[2], 'i')
const wpn = weapons.find(wpn => search.exec(wpn.name))
for(const override of process.argv.slice(3)) {
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
const buf = Buffer.alloc(0x4c)
for(let i = 0; i < schema.length; i++) {
  const offset = i * 0x4
  const [prop, cb] = schema[i]
  Int(buf, wpn[prop] || 0, offset)
}
console.log(buf)
