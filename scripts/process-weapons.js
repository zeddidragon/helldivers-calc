import fs from 'fs'
import toml from 'toml'
import json from 'json-stringify-pretty-compact'
function read(file) {
  return JSON.parse(fs.readFileSync(`data/${file}.json`))
}

const data = read('datamined')
const shalzuth = read('shalzuth')
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
  'viper-commandos',
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

const matches = []
const shalzuthMatch = {}

const shalzuthSchema = [
  { source: 'magazine_capacity', cb: (wpn, cap) => {
    if(wpn.cap) {
      return
    }
    if(!isNaN(cap)) {
      wpn.cap = cap
    } else if(cap.x != null) {
      wpn.cap = cap.x + cap.y
    }
  }},
  { source: 'magazines_max', dest: 'mags' },
  { source: 'magazines', dest: 'magstart' },
  { source: 'chambered', dest: 'capplus' },
  { source: 'magazines_refill', dest: 'supply' },
  { source: 'ammo_capacity', dest: 'rounds' },
  { source: 'ammo', dest: 'roundstart' },
  { source: 'ammo_refill', dest: 'roundsupply' },
  { source: 'ammo_types', cb: (wpn, { primary_projectile_type: prj }) => {
    // There's also alternate_projectile_type, as of this date not really used
    if(wpn.attack) {
      return
    }
    if(prj === 'ProjectileType_None') {
      return
    }
    wpn.attack = [{
      medium: 'projectile',
      ref: prj.replace('ProjectileType_', ''),
    }]
  }},
  { source: 'projectile_type', cb: (wpn, prj) => {
    if(wpn.attack) {
      return
    }
    wpn.attack = [{
      medium: 'projectile',
      ref: prj.replace('ProjectileType_', ''),
    }]
  }},
  { source: 'explosion_type', cb: (wpn, exp) => {
    if(!wpn.attack) {
      wpn.attack = []
    }
    wpn.attack.push({
      medium: 'explosion',
      ref: exp.replace('ExplosionType_', ''),
    })
  }},
  { source: 'on_stick_damage_type', cb: (wpn, dmg) => {
    if(wpn.attack) {
      return
    }
    if(dmg === 'DamageInfoType_None') {
      return
    }
    wpn.attack = [{
      medium: 'damage',
      ref: dmg.replace('DamageInfoType_', ''),
    }]
  }},
  { source: 'recoil_info', cb: (wpn, { drift }) => {
    wpn.recoilxy = {
      x: +drift.horizontal_recoil.toFixed(2),
      y: +drift.vertical_recoil.toFixed(2),
    }
  }},
  { source: 'spread_info', cb: (wpn, spread) => {
    wpn.spreadxy = {
      x: +spread.horizontal.toFixed(2),
      y: +spread.vertical.toFixed(2),
    }
  }},
  { source: 'ergonomics' },
  { source: 'fire_modes', cb: (wpn, modes) => {
    wpn.modes = modes
      .map(m => m.replace('FireMode_', ''))
      .filter(m => m !== 'None')
  }},
  { source: 'num_burst_rounds', dest: 'burst' },
  { source: 'equipment_type', cb: (wpn, cat) => {
    wpn.category = wpn.category || cat.replace('EquipmentType_', '')
  }},
  { source: 'rounds_per_minute', cb: (wpn, rpms) => {
    if(rpms > 0) {
      wpn.rpm = rpms
      return
    }
    wpn.rpm = rpms.y
    let rpmArr = [
      rpms.x,
      rpms.y,
      rpms.z,
    ].filter(v => v)
    if(rpmArr.length > 1) {
      wpn.rpm = rpmArr[rpmArr.length - 1]
      wpn.rpms = rpmArr
    }
  }},
  { source: 'overheat_temperature', cb: (wpn, temp, cfg) => {
    if(!wpn.limit && cfg.temp_gain_per_second) {
      wpn.limit = temp / cfg.temp_gain_per_second
    } else if(!wpn.limit && cfg.temp_gain_per_shot && wpn.rpm) {
      wpn.limit = +(temp / (cfg.temp_gain_per_shot * wpn.rpm / 60)).toFixed(1)
    }
    if(!wpn.heatdown) {
      wpn.heatdown = +(temp / cfg.temp_loss_per_second).toFixed(1)
    }
  }},
]

let dbgCondition = false
const keyed = {}
for(const wpn of [...setup.weapon, ...setup.stratagem]) {
  for(const prop of purge) {
    delete wpn[prop]
  }
  const name = wpn.name || wpn.fullname
  let matched
  if(wpn.entity) {
    matched = shalzuth[wpn.entity]
  }
  if(wpn.entity && !matched) {
    console.error(`Entity ID not found: "${wpn.entity}"`)
  } else if(wpn.entity) {
    delete wpn.entity
  }
  if(!matched) {
    const shalzuthMatches = Object.values(shalzuth).filter(obj => {
      return obj.key === name  || obj.name === name
    })
    if(shalzuthMatches.length > 1) {
      console.error(`Too many matches for: "${name}" (${shalzuthMatches.length})`)
    }

    matched = shalzuthMatches[0]
  }

  if(!matched) {
    console.error(`No matches for: "${name}"`)
    continue
  }
  
  for(const { source, dest = source, cb } of shalzuthSchema) {
    if(wpn[dest]) {
      continue
    }
    const v = matched[source]
    if(v == null) {
      continue
    }

    if(cb) {
      cb(wpn, v, matched)
    } else {
      wpn[dest] = v
    }
  }

  if(dbgCondition) {
    console.log(name, matched, wpn)
    dbgCondition = false
  }

  // Remove/constrain some garbage data
  if(wpn.supply > wpn.mags) {
    Math.max(Math.floor(wpn.box = wpn.supply * 0.5), wpn.mags)
    wpn.supply = wpn.mags
  }
  if(wpn.supply === 0) {
    delete wpn.supply
    delete wpn.box
  }
  if(wpn.rounds && wpn.mags) {
    delete wpn.mags
    delete wpn.supply
    delete wpn.box
  }
}

setup.weapon = setup.weapon.map(wpn => {
  const obj = {}
  for(const key of Object.keys(wpn).sort()) {
    obj[key] = wpn[key]
  }
  return obj
})

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
      const element = data.elements[obj.type]
      obj2 = {
        ...obj2,
        element_name: obj.type ? names[`dmg.types.full;${element}`] : void 0,
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

const wikiCategories = [
  "Assault Rifle",
  "Shotgun",
  "Marksman Rifle",
  "Submachine Gun",
  "Explosive",
  "Energy-Based",
  "Pistol",
  "Support Weapon",
]

const allWeapons = [
  ...setup.weapon,
  ...setup.stratagem,
]
const weaponOrder = []
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
  const category = names[`wpn.category.full;${wpn.category}`]
  if(wikiCategories.includes(category)) {
    weaponOrder[i++] = wpn.fullname
  }
  wpn.attack = attacks
  reg[wpn.fullname] = {
    ...wpn,
    category,
    fullname: void 0,
    attack: void 0,
    attacks,
  }
}
wikiRegister.weapon_order = weaponOrder

fs.writeFileSync('data/wiki.json', JSON.stringify(wikiRegister, null, 2))

fs.writeFileSync('data/weapons.json', json({
  sources,
  weapons: setup.weapon,
  stratagems: setup.stratagem,
}))
