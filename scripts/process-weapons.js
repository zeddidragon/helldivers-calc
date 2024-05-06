import fs from 'fs'

function frames(stamp) {
  if(!stamp || stamp === '') {
    return 
  }
  const values = stamp.split(':')
  return values
    .map((v, i) => Math.pow(60, values.length - i - 1) * v)
    .reduce((sum, v) => sum + v, 0)
}

let weapons = JSON.parse(fs.readFileSync('./data/weapons.json', 'utf-8').trim())
const idMap = fs.readFileSync('data/id-mapping.csv', 'utf-8')
  .split('\n')
  .slice(1)
  .map(r => r.split(','))
  .map(([name, prop, id]) => {
    return {
      name,
      prop,
      id,
    }
  })
const {
  item: damages,
} = JSON.parse(fs.readFileSync('./data/datamined.json', 'utf-8').trim())
const reloads = fs.readFileSync('./data/reloads.csv', 'utf-8')
  .trim()
  .split('\n')
  .slice(1)
  .map(r => r.split(','))
  .map(([name, rStart, rEnd, eStart, eEnd, xStart, xEnd]) => {
    return {
      name,
      reload: Math.round((frames(rEnd) - frames(rStart)) / 6) / 10,
      reloadearly: eStart && Math.round((frames(eEnd) - frames(eStart)) / 6) / 10,
      xtime: eStart && Math.round((frames(xEnd) - frames(xStart)) / 6) / 10,
    }
  })

const reloadRegister = {}
for(const r of reloads) {
  reloadRegister[r.name] = r
}
const damageRegister = {}
for(const dmg of damages) {
  damageRegister[dmg.id] = dmg
}

for(const wpn of weapons) {
  const name = `${wpn.code} ${wpn.name}`
  const r = reloadRegister[name]
  wpn.fullname ||= name
  if(!wpn.source) {
    wpn.source = 'support'
  }
  if(r) {
    wpn.reload = r.reload
    if(r.reloadearly && r.reloadearly !== r.reload) {
      wpn.reloadearly = r.reloadearly
    }
    if(r.xtime) {
      wpn.reloadx = r.xtime
    }
  }
  if(wpn.reloadearly && wpn.rounds) {
    wpn.reloadone = wpn.reloadearly
    delete wpn.reloadearly
  }
  const damageIds = idMap.filter(m => m.name === name)
  for(const id of damageIds) {
    const dmg = damageRegister[id.id]
    wpn[id.prop] = dmg.damage
    const prefix = id.prop === 'damage' ? '' : id.prop[0]
    if(!prefix && wpn.tags?.includes('laser')) {
      wpn.dps = dmg.damage
    }
    wpn[`${prefix}id`] = id.id
    wpn[`${prefix}durable`] = dmg.secondaryDamage
    wpn[`${prefix}ap`] = dmg.pen1
    wpn[`${prefix}ap2`] = dmg.pen2
    wpn[`${prefix}ap3`] = dmg.pen3
    wpn[`${prefix}ap4`] = dmg.pen4
    wpn[`${prefix}demo`] = dmg.demolition
    wpn[`${prefix}stun`] = dmg.stun
    wpn[`${prefix}push`] = dmg.push
    wpn[`${prefix}unknown4`] = dmg.unknown4
    wpn[`${prefix}unknown5`] = dmg.unknown5
    wpn[`${prefix}float1`] = dmg.float1
    wpn[`${prefix}unknown6`] = dmg.unknown6
    wpn[`${prefix}float2`] = dmg.float2
  }
}
let keys = new Set(weapons.slice(1).map(w => Object.keys(w)).flat())
const keyObj = weapons[0]
for(const key of keys) {
  if(keyObj[key] == null) {
    keyObj[key] = 0
  }
}

keys = Object.keys(keyObj)
// Standardize key order
weapons = weapons.map(wpn => {
  const obj = {}
  for(const key of keys) {
    if(wpn[key] != null) {
      obj[key] = wpn[key]
    }
  }
  return obj
})

fs.writeFileSync('data/weapons.json', JSON.stringify(weapons, null, 2))

const wikiTables = weapons.slice(1).map(wpn => {
  const shots = wpn.pellets || 1
  return `# ${wpn.code} ${wpn.name}
{{Weapon_Damage_Statistics
  | standard_damage = ${wpn.damage * shots}
  | durable_damage = ${wpn.durable * shots}
  | aoe_standard_damage = ${wpn.xdamage * shots || ''}
  | aoe_durable_damage = ${wpn.xdurable * shots || ''}
  | pellet_amount = ${wpn.pellets || ''}
  | pellet_standard_damage = ${(wpn.pellets && wpn.damage) || ''}
  | pellet_durable_damage = ${(wpn.pellets && wpn.durable) || ''}
  | stagger_value = ${wpn.stun}
  | aoe_stagger_value = ${wpn.xstun || ''}
  | knockback_value = ${wpn.push || ''}
  | aoe_knockback_value = ${wpn.xpush || ''}
  | structure_destroyer =
  | penetration_direct = ${wpn.ap}
  | penetration_angle_slight = ${(wpn.ap2 < wpn.ap && wpn.ap2) || ''}
  | penetration_angle_heavy = ${(wpn.ap3 < wpn.ap && wpn.ap3) || ''}
  | penetration_aoe = ${wpn.xap || ''}
}}`
}).join('\n\n')

fs.writeFileSync('wiki-tables.md', wikiTables)