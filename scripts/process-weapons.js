import fs from 'fs'
import toml from 'toml'
import json from 'json-stringify-pretty-compact'
function read(file) {
  return JSON.parse(fs.readFileSync(`data/${file}.json`))
}

const data = read('datamined')
const setup = toml.parse(fs.readFileSync('data/weapons.toml'))
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

let wps = setup.weapon.slice()
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
  weapon: 'wpnname',
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
    const key = atkKey(prop, obj.enum)
    refRegister[key] = obj
    register[prop][obj.id] = obj
  }
}

for(const prop of Object.keys(wikiRegister)) {
  const reg = wikiRegister[prop]
  const plural = `${prop}s`
  for(const obj of (data[plural] || [])) {
    const key = atkKey(prop, obj.enum)
    let obj2 = {
      ...obj,
      enum: void 0,
      name: names[key],
      id: void 0,
    }
    if(prop === 'damage') {
      obj2 = {
        ...obj2,
        element_name: obj.type ? names[`dmg.types.full;${obj.type}`] : void 0,
        status_name: obj.func1 ? data.statusNames[obj.func1 - 1] : void 0,
        status_name2: obj.func2 ? data.statusNames[obj.func2 - 1] : void 0,
        status_name3: obj.func3 ? data.statusNames[obj.func3 - 1] : void 0,
        status_name4: obj.func4 ? data.statusNames[obj.func4 - 1] : void 0,
        status_name5: obj.func5 ? data.statusNames[obj.func5 - 1] : void 0,
        status_name6: obj.func6 ? data.statusNames[obj.func6 - 1] : void 0,
      }
    }
    if(obj.ximpactid) {
      obj2.ximpactid = register.explosion[obj.ximpactid].enum
    } else {
      delete obj2.ximpactid
    }
    if(obj.xdelayid) {
      obj2.xdelayid = register.explosion[obj.xdelayid].enum
    } else {
      delete obj2.xdelayid
    }
    if(obj.damageid) {
      obj2.damageid = register.damage[obj.damageid].enum
    } else {
      delete obj2.damageid
    }
    if(obj.projectileid) {
      obj2.projectileid = register.projectile[obj.projectileid].enum
    } else {
      delete obj2.projectileid
    }
    reg[obj.enum] = obj2
  }
}

function unrollAttack(attack) {
  const unrolled = [attack]
  const {
    type,
    name,
    count,
  } = attack
  const obj = wikiRegister[type][name]
  console.log(obj)
  if(obj?.shrapnel && obj?.projectileid) {
    const projectile = wikiRegister.projectile[obj.projectileid]
    unrolled.push(...unrollAttack({
      type: 'projectile',
      name: obj.projectileid,
      count: obj.shrapnel,
    }))
  }
  if(obj?.ximpactid) {
    const explosion = wikiRegister.explosion[obj.ximpactid]
    unrolled.push(...unrollAttack({
      type: 'explosion',
      name: obj.ximpactid,
      count,
    }))
  }
  if(obj?.xdelayid && obj.xdelayid !== obj.ximpactid) {
    const explosion = wikiRegister.explosion[obj.xdelayid]
    unrolled.push(...unrollAttack({
      type: 'explosion',
      name: obj.xdelayid,
      count,
    }))
  }

  return unrolled
}

const allWeapons = [
  ...setup.weapon,
  ...setup.stratagem,
]
let i = 0
for(const wpn of allWeapons) {
  const reg = wikiRegister.weapon
  const type = wpn.type
  refRegister[atkKey('weapon', wpn.fullname)] = wpn
  const attacks = (wpn.attack || []).flatMap(atk => {
    const key = atkKey(atk.medium, atk.ref)
    const obj = refRegister[key]
    return unrollAttack({
      type: atk.medium,
      name: atk.ref,
      count: atk.count,
    })
  })
  wpn.attack = attacks
  reg[wpn.fullname] = {
    idx: ++i,
    ...wpn,
    category: names[`wpn.category.full;${wpn.category}`],
    fullname: void 0,
    attack: void 0,
    attacks,
  }
}

fs.writeFileSync('data/wiki.json', json(wikiRegister))

fs.writeFileSync('data/weapons.json', json({
  sources,
  weapons: wps,
  stratagems: setup.stratagem,
}))
