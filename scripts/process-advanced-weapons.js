import fs from 'fs'
import json from 'json-stringify-pretty-compact'

function read(file) {
  return JSON.parse(fs.readFileSync(`data/${file}.json`))
}

const data = read('datamined')
const weapons = read('weapons')
const names = read('lang-en')
const sources = [
  'dlc-super',
  'start',
  'hd-mobilize',
  'steel-vets',
  'cut-edge',
  'demo-det',
  'polar-pat',
  'support',
]

const purge = [
  "code",
  "name",
  "idx",
  "catIdx",
  "pellets",
  "velocity",
  "caliber",
  "bulletmass",
  "drag",
  "gravity",
  "penslow",
  "id",
  "damage",
  "durable",
  "ap",
  "ap2",
  "ap3",
  "ap4",
  "stun",
  "push",
  "demo",
  "xid",
  "xdamage",
  "xdurable",
  "xap",
  "xap2",
  "xap3",
  "xap4",
  "xstun",
  "xpush",
  "xdemo",
  "dps",
  "dmgtypename",
  "effect1name",
  "statusap",
  "dmgtype",
  "effect1",
  "param1",
  "effect2",
  "param2",
  "xdmgtype",
  "xeffect1",
  "xparam1",
  "xeffect2",
  "xparam2",
]

let wps = weapons.slice(1)
const seen = new Set()
wps = wps.filter(f => {
  if(seen.has(f.fullname)) {
    return false
  }
  seen.add(f.fullname)
  return true
})
const matches = []
const keyed = {}
for(const wpn of wps) {
  for(const prop of purge) {
    delete wpn[prop]
  }
  keyed[wpn.fullname] = wpn
}

const touched = new Set()
fs.readFileSync('data/advanced-id-mapping.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .forEach(r => {
    const [
      name,
      type,
      enm, // "enum" is reserved
      id,
      count,
    ] = r.split(',')
    const weapon = keyed[name]
    if(!weapon) {
      console.error(`Weapon not found: ${r}`)
      return
    }
    if(!touched.has(name)) {
      touched.add(name)
      weapon[`${type}id`] = +id
      weapon.type = type
      weapon.count = count && +count
    } else {
      if(!weapon.subattacks) {
        weapon.subattacks = []
      }
      weapon.subattacks.push({
        type,
        id: +id,
        count: count && +count,
      })
    }
  })

fs.writeFileSync('data/advanced.json', json({
  sources,
  weapons: wps,
}))

const wikiRegister = {
  damage: {},
  projectile: {},
  explosion: {},
  beam: {},
  arc: {},
  weapon: {},
}
const register = {}
const tkeys = {
  damage: 'dmg',
  projectile: 'prj',
  explosion: 'aoe',
  beam: 'beam',
  arc: 'arc',
}

for(const prop of Object.keys(wikiRegister)) {
  const reg = wikiRegister[prop]
  const plural = `${prop}s`
  register[prop] = {}
  for(const obj of (data[plural] || [])) {
    register[prop][obj.id] = obj
    const key = `${tkeys[prop]};${obj.enum}`
    reg[obj.enum] = {
      ...obj,
      enum: void 0,
      status_name: obj.func1 ? data.statuses[obj.func1] : void 0,
      damageid: void 0,
      name: names[key],
      damage_name: register.damage[obj.damageid]?.enum,
    }
  }
}

for(const wpn of wps) {
  const reg = wikiRegister.weapon
  const type = wpn.type
  const id = wpn.projectileid
    || wpn.beamid
    || wpn.arcid
    || wpn.explosionid
    || wpn.damageid
  const attacks = []
  if(id) {
    attacks.push({
      type: type || 'damage',
      name: register[type][id].enum,
      id,
      count: wpn.count,
    })
  }
  if(wpn.subattacks) {
    attacks.push(...wpn.subattacks.map(sub => {
      const {
        type,
        id,
        count,
      } = sub
      return {
        type,
        name: register[type][id].enum,
        id,
        count,
      }
    }))
  }
  reg[wpn.fullname] = {
    ...wpn,
    fullname: void 0,
    type: void 0,
    damageid: void 0,
    beamid: void 0,
    arcid: void 0,
    projectileid: void 0,
    explosionid: void 0,
    subattacks: void 0,
    attacks,
  }
}

fs.writeFileSync('data/wiki.json', json(wikiRegister))
