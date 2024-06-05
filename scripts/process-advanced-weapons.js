import fs from 'fs'
import json from 'json-stringify-pretty-compact'
import toml from 'toml'

function read(file) {
  return JSON.parse(fs.readFileSync(`data/${file}.json`))
}

const data = read('datamined')
const { weapon: weapons } = toml.parse(fs.readFileSync('data/weapons.toml'))
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

let wps = weapons.slice()
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
const refRegister = {}

function atkKey(type, ref) {
  return `${tkeys[type]};${ref}`
}

function getAtk(type, ref) {
  return register[atkKey(type, ref)]
}

for(const prop of Object.keys(wikiRegister)) {
  const reg = wikiRegister[prop]
  const plural = `${prop}s`
  register[prop] = {}
  for(const obj of (data[plural] || [])) {
    register[prop][obj.id] = obj
    const key = atkKey(prop, obj.enum)
    refRegister[key] = obj
    reg[obj.enum] = {
      ...obj,
      enum: void 0,
      status_name: obj.func1 ? data.statusNames[obj.func1 - 1] : void 0,
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
  const attacks = (wpn.attacks || []).map(atk => {
    const key = `${tkeys[atk.medium]};${atk.ref}`
    const obj = refRegister[key]
    console.log({ key, obj })
    return {
      type: atk.medium,
      name: atk.ref,
      count: atk.count,
      id: obj.id,
    }
  })
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

for(const wpn of weapons) {
  if(!wpn.attacks) {
    continue
  }
  const [atk, ...subattacks] = wpn.attacks.map(atk => {
    const key = atkKey(atk.medium, atk.ref)
    const obj = refRegister[key]
    console.log({ atk,  key, obj })
    return {
      type: atk.medium,
      id: obj.id,
      count: atk.count,
    }
  })
  wpn[`${atk.type}id`] = atk.id
  if(atk.count) {
    wpn.count = atk.count
  }
  if(subattacks.length) {
    wpn.subattacks = subattacks
  }
  delete wpn.attacks
}

fs.writeFileSync('data/advanced.json', json({
  sources,
  weapons: wps,
}))
