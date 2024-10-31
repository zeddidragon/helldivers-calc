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

const matches = []
const shalzuthMatch = {}

function applySchema(wpn, { source, dest = source, cb }, data) {
  if(wpn[dest] != null) {
    return
  }

  const v = data[source]
  if(v == null) {
    return
  }

  if(cb) {
    cb(wpn, v, data)
  } else {
    wpn[dest] = v
  }
}

const modifierFuncs = {
  Add_Ergonomics: (wpn, v) => wpn.ergonomics += v,
  Mul_SpreadHorizontal: (wpn, v) => wpn.spreadxy.x *= v,
  Mul_SpreadVertical: (wpn, v) => wpn.spreadxy.y *= v,
  Mul_RecoilHorizontal: (wpn, v) => wpn.recoilxy.x *= v,
  Mul_RecoilHorizontalAlt: (wpn, v) => void 0, // Noop?
  Mul_RecoilVertical: (wpn, v) => wpn.recoilxy.y *= v,
  Mul_RecoilVerticalAlt: (wpn, v) => void 0, // Noop?
}

let allModifiers = new Set()
const shalzuthSchema = [
  { source: 'customizations', cb: (wpn, data, ) => {
    shalzuthSchema.slice(1).forEach(entry => applySchema(wpn, entry, data))
  }},
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
  { source: 'charges', dest: 'charges' },
  { source: 'duration', dest: 'reload' },
  { source: 'magazines_max', dest: 'mags' },
  { source: 'magazines', dest: 'magstart' },
  { source: 'chambered', dest: 'capplus' },
  { source: 'magazines_refill', dest: 'supply' },
  { source: 'ammo_capacity', dest: 'rounds' },
  { source: 'ammo', dest: 'roundstart' },
  { source: 'ammo_refill', dest: 'roundsupply' },
  { source: 'ammo_types', cb: (wpn, {
    primary_projectile_type: prj,
    alternate_projectile_type: prj2,
  }) => {
    if(!wpn.attack) {
      wpn.attack = []
    }
    if(prj) {
      wpn.attack[0] = {
        medium: 'projectile',
        ref: prj,
      }
    }
    if(prj2 && prj2 !== prj) {
      wpn.attack[1] = {
        medium: 'projectile',
        ref: prj2,
      }
    }
  }},
  { source: 'projectile_type', cb: (wpn, prj) => {
    if(wpn.attack) {
      return
    }
    wpn.attack = [{
      medium: 'projectile',
      ref: prj,
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
      wpn.limit = +(temp / cfg.temp_gain_per_second).toFixed(2)
    } else if(!wpn.limit && cfg.temp_gain_per_shot && wpn.rpm) {
      wpn.limit = +(temp / (cfg.temp_gain_per_shot * wpn.rpm / 60)).toFixed(1)
    }
    if(!wpn.heatdown) {
      wpn.heatdown = +(temp / cfg.temp_loss_per_second).toFixed(1)
    }
  }},
  { source: 'modifiers', cb: (wpn, data) => {
    for(const { type, value } of data) {
      modifierFuncs[type.replace('WeaponStatModifierType_', '')](wpn, value)
      allModifiers.add(type)
    }
  }},
]

const stratByName = Object.fromEntries(
  Object.entries(data.stratagem)
    .map(([ref, strat]) => {
      return [strat.name, {
        ref,
        ...strat,
      }]
    }))

function eatSubobjects(obj, prop) {
  let arr = obj[prop]
  if(!arr) {
    return
  }
  if(!Array.isArray(arr)) {
    arr = [arr]
  }
  for(const id of arr) {
      const entity = { ...(shalzuth[id] || {}) }
      delete entity.id
      Object.assign(obj, entity)
  }
  delete obj[prop]
}

function push(obj, prop, ...pushed) {
  obj[prop] = [...(obj[prop] || []), ...pushed]
}

const airstrikePatterns = {
  // Used by:
  // - Eagle Airstrike
  // - Eagle Strafing Run
  // - Eagle 110mm Rocket Pods
  '6Z': (wpn) => {
    if(wpn.magazine_capacity < 2000) {
      wpn.cap = wpn.magazine_capacity
    } else {
      wpn.cap = 6
    }
    if(wpn.name === 'Eagle 110mm Rocket Pods') {
      // 110mm rockets redundantly listed on main body as well as left and right sidecs
      wpn.attack = [{
        count: 2,
        ...wpn.attack[2],
      }]
    }
    if(wpn.name === 'Eagle Strafing Run') {
      wpn.cap = Math.round(wpn.rounds_per_minute.y * wpn.fire_duration / 60)
    }
  },
  'Single': (wpn) => {
    wpn.cap = 1
  },
  '4line_Napalm_MK1': (wpn) => {
    wpn.cap = 4
  },
  '8line_ClusterBomb': (wpn) => {
    wpn.cap = 8
  },
  '8line_Napalm_ClusterBomb': (wpn) => {
    wpn.cap = 8
  },
}
function eagleAirstrike(wpn, strikeType) {
  const cb = airstrikePatterns[strikeType]
  wpn.cap = Math.round(wpn.fire_duration / (wpn.bomb_interval + wpn.bomb_prediction_interval))
  if(!cb) {
    console.error('Pattern not implemented: ', strikeType)
  } else {
    cb(wpn)
  }
  delete wpn.magazine_capacity
  return
}

setup.stratagem = setup.stratagem
  .map(strat => {
    const name = strat.name || strat.fullname
      .split(/\s+/)
      .slice(1)
      .join(' ')
    const stratData = stratByName[name] || {}
    const obj = {
      ...stratData,
      ...strat,
    }
    const entityQueue = []

    // Usually we care only about the first payload item
    // The second will be the delivery method,
    // such as the hellpod or pelican
    if(obj.payload?.length > 1) {
      obj.payload = [obj.payload[0]]
    }
    eatSubobjects(obj, 'payload')
    eatSubobjects(obj, 'racked')
    eatSubobjects(obj, 'drone_path')
    for(const { id, side } of obj.mounts || []) {
      if(side === 'Common') {
        obj.mount = id
        eatSubobjects(obj, 'mount')
        continue
      }
      const wpnName = `${name} - ${side}`
      const weapon = {
        category: 'Mounted',
        name: wpnName,
        entity: id,
      }
      setup.weapon.push(weapon)
      push(obj, 'attack', {
        medium: 'weapon',
        side,
        ref: wpnName,
      })
    }
    delete obj.mounts
    eatSubobjects(obj, 'throwable_path')
    obj.name = strat.name || name || obj.name
    obj.fullname = strat.fullname || obj.fullname
    if(obj.panel_count && obj.throwable_count) {
      obj.salvos = obj.panel_count
      obj.cap = obj.throwable_count
    }
    if(obj.projectile_type) {
      push(obj, 'attack', {
        medium: 'projectile',
        ref: obj.projectile_type,
      })
    }
    if(obj.beam_type) {
      push(obj, 'attack',  {
        medium: 'beam',
        ref: obj.beam_type,
      })
    }
    if(obj.explosion_type) {
      push(obj, 'attack', {
        medium: 'explosion',
        ref: obj.explosion_type,
      })
    }
    if(obj.arc_type) {
      push(obj, 'attack', {
        medium: 'arc',
        ref: obj.arc_type,
      })
    }
    if(obj.damage_type) {
      push(obj, 'attack', {
        medium: 'damage',
        ref: obj.damage_type,
      })
    }
    if(obj.airstrike_pattern) {
      eagleAirstrike(obj, obj.airstrike_pattern)
    }
    return obj
  })

const stratWeapons = {}
for(const [ref, strat] of Object.entries(data.stratagem)) {
  const payload = shalzuth[strat.payload[0]]
  if(!payload?.racked) { continue }
  const racked = payload.racked
    .map(id => shalzuth[id])
    .filter(v => v)
  if(!racked.length) {
    continue
  }
  if(racked[0].key) {
    stratWeapons[racked[0].key] = {
      ref,
      strat,
      payload,
      racked,
    }
  }
}

let dbgCondition = false
const keyed = {}
for(const wpn of setup.weapon) {
  const name = wpn.ref || wpn.name || wpn.fullname
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
  

  shalzuthSchema.forEach(entry => applySchema(wpn, entry, matched))

  if(dbgCondition) {
    console.log(name, matched, wpn)
    dbgCondition = false
  }

  if(stratWeapons[name]) {
    const {
      ref,
      strat,
      racked,
    } = stratWeapons[name]
    Object.assign(wpn, {
      ref,
    }, strat, wpn)
    delete wpn.payload
    delete wpn.weaponid
    wpn.category = 'SUP'
    racked.forEach(rack => {
      shalzuthSchema.forEach(entry => {
        applySchema(wpn, entry, rack)
      })
    })
  }

  // Remove/constrain some garbage data
  if(wpn.supply > wpn.mags) {
    Math.min(Math.floor(wpn.box = wpn.supply * 0.5), wpn.mags)
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
  if(wpn.capplus === 0) {
    delete wpn.capplus
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
  ...data,
  weapon: {},
}
delete wikiRegister.stratagem

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
  for(const [ref, obj] of Object.entries(data[prop] || {})) {
    const key = atkKey(prop, ref)
    let obj2 = {
      ...obj,
      enum: void 0,
      name: names[key],
      id: void 0,
    }
    if(prop === 'damage') {
      const { element } = obj
      obj2 = {
        ...obj2,
        element: void 0,
        status1: void 0,
        status2: void 0,
        status3: void 0,
        status4: void 0,
        element_name: names[`dmg.types.full;${element}`],
        status_name: names[`dmg.effects.full;${obj.status1}`],
        status_name2: names[`dmg.effects.full;${obj.status2}`],
        status_name3: names[`dmg.effects.full;${obj.status3}`],
        status_name4: names[`dmg.effects.full;${obj.status4}`],
      }
    }
    obj2.ximpactid = obj.ximpactref
    delete obj2.ximpactref
    obj2.xdelayid = obj.xdelayref
    delete obj2.xdelayref
    obj2.projectileid = obj.projectileref || obj.shrapnelref
    delete obj2.projectileref
    obj2.damageid = obj.damageref
    delete obj2.damageref
    reg[ref] = obj2
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
  const name = wpn.fullname || wpn.name
  const reg = wikiRegister.weapon
  const type = wpn.type
  refRegister[atkKey('weapon', name)] = wpn
  for(const charge of (wpn.charges || [])) {
    if(charge.projectile_type) {
      charge.attack = unrollAttack({
        type: 'projectile',
        name: charge.projectile_type
      })
      delete charge.projectile_type
    }
  }
  const attacks = (wpn.attack || []).flatMap(atk => {
    const {
      medium: type,
      count,
      weapon,
      ref = weapon.id,
    } = atk
    return unrollAttack({
      type,
      name: ref,
      count,
    })
  })
  const category = names[`wpn.category.full;${wpn.category}`]
  if(wikiCategories.includes(category)) {
    weaponOrder[i++] = wpn.fullname
  }
  wpn.attack = attacks
  reg[name] = {
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
