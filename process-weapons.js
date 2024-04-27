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

const weapons = JSON.parse(fs.readFileSync('./data/weapons.json', 'utf-8').trim())
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
  .map(([name, rStart, rEnd, eStart, eEnd]) => {
    return {
      name,
      reload: Math.round((frames(rEnd) - frames(rStart)) / 6) / 10,
      reloadearly: eStart && Math.round((frames(eEnd) - frames(eStart)) / 6) / 10,
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
  if(!wpn.source) {
    wpn.source = 'support'
  }
  if(r) {
    wpn.reload = r.reload
    if(r.reloadearly && r.reloadearly !== r.reload) {
      wpn.reloadearly = r.reloadearly
    }
  }
  const damageIds = idMap.filter(m => m.name === name)
  for(const id of damageIds) {
    const dmg = damageRegister[id.id]
    wpn[id.prop] = dmg.damage
    const prefix = id.prop === 'damage' ? '' : id.prop[0]
    if(!prefix && wpn.tags?.includes('laser')) {
      wpn.dps = dmg.damage
    }
    wpn[`${prefix}durable`] = dmg.secondaryDamage
    wpn[`${prefix}ap`] = dmg.pen1
    wpn[`${prefix}stun`] = dmg.unknown2
    wpn[`${prefix}push`] = dmg.unknown3
  }
  if(wpn.reloadearly && wpn.rounds) {
    wpn.reloadone = wpn.reloadearly
    delete wpn.reloadearly
  }
}

fs.writeFileSync('data/weapons.json', JSON.stringify(weapons, null, 2))
