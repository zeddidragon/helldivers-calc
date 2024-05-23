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
  strikes,
  projectiles: ballistics,
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
const strikeRegister = {}
for(const strike of strikes) {
  strikeRegister[strike.id] = strike
}
const ballisticsRegister = {}
for(const b of ballistics) {
  ballisticsRegister[b.id] = b
}

for(const wpn of weapons) {
  const name = [wpn.code, wpn.name]
    .filter(v => v)
    .join(' ')
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
  const ids = idMap.filter(m => m.name === name)
  for(const id of ids) {
    if(id.prop === 'ballistics') {
      const ballistics = ballisticsRegister[id.id]
      if(!ballistics) {
        continue
      }
      wpn.ballisticid = ballistics.id
      if(ballistics.pellets > 1) {
        wpn.pellets = ballistics.pellets
      }
      wpn.velocity = ballistics.velocity
      wpn.caliber = ballistics.caliber
      wpn.bulletmass = ballistics.mass
      wpn.drag = ballistics.drag
      if(wpn.gravity != 0) {
        wpn.gravity = ballistics.gravity
      }
      wpn.penslow = ballistics.penslow
      continue
    }
    const strike = strikeRegister[id.id]
    if(!strike) {
      continue
    }
    wpn[id.prop] = strike.dmg
    const prefix = id.prop === 'damage' ? '' : id.prop[0]
    if(!prefix && wpn.tags?.includes('laser')) {
      wpn.dps = strike.dmg
    }
    wpn[`${prefix}id`] = id.id
    wpn[`${prefix}durable`] = strike.mass
    wpn[`${prefix}ap`] = strike.ap1
    wpn[`${prefix}ap2`] = strike.ap2
    wpn[`${prefix}ap3`] = strike.ap3
    wpn[`${prefix}ap4`] = strike.ap4
    wpn[`${prefix}demo`] = strike.demo
    wpn[`${prefix}stun`] = strike.stun
    wpn[`${prefix}push`] = strike.push
    wpn[`${prefix}dmgtype`] = strike.type
    wpn[`${prefix}effect1`] = strike.func1
    wpn[`${prefix}param1`] = strike.param1
    wpn[`${prefix}effect2`] = strike.func2
    wpn[`${prefix}param2`] = strike.param2
  }
}
for(const wpn of weapons) {
  delete wpn.unknown4
  delete wpn.unknown5
  delete wpn.float1
  delete wpn.unknown6
  delete wpn.float2
  delete wpn.xunknown5
  delete wpn.xfloat1
  delete wpn.xunknown6
  delete wpn.xfloat2
}
let keys = new Set(weapons.slice(1).map(w => Object.keys(w)).flat())

const types = {
  1: 'Fire',
  2: 'Arc',
}
function dmgtype(wpn) {
  const prop = wpn.dmgtype
  if(!prop) return ''
  return types[prop] || `Unknown (${prop})`
}
const effects = {
  6: 'Burn',
  34: 'Stun',
}
function effect(wpn) {
  const prop = wpn.effect1
  if(!prop) return ''
  return effects[prop] || `Unknown (${prop})`
}
function param(wpn) {
  const value = wpn.param1
  if(value == null) return ''
  return value
}

const props = [
  'dmgtype',
  'effect1',
  'effect2',
  'param1',
  'param2',
  'xdmgtype',
  'xeffect1',
  'xeffect2',
  'xparam1',
  'xparam2',
]

for(const wpn of weapons.slice(0)) {
  for(const prop of props) {
    if(wpn[prop] === 0) {
      delete wpn[prop]
    }
  }
  if(wpn.code?.startsWith('LAS')) {
    delete wpn.effect1
    delete wpn.effect1name
    delete wpn.param1
  }
  if(wpn.effect1 === 6) {
    wpn.statusap = 4
  }
  if(wpn.dmgtype) {
    wpn.dmgtypename = types[wpn.dmgtype]
  }
  if(wpn.effect1) {
    wpn.effect1name = effects[wpn.effect1]
  }
}

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
