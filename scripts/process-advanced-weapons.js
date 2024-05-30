import fs from 'fs'
import json from 'json-stringify-pretty-compact'

function read(file) {
  return JSON.parse(fs.readFileSync(`data/${file}.json`))
}

const data = read('datamined')
const weapons = read('weapons')

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
  "damage",
  "durable",
  "ap",
  "ap2",
  "ap3",
  "ap4",
  "stun",
  "push",
  "demo",
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

const overrides = {
  "RL-77 Airburst Rocket Launcher": {
    "subattacks": [{
      "type": "explosion",
      "id": 0xAC,
    }, {
      "type": "explosion",
      "id": 0xA5,
      "count": 8,
    }, {
      "type": "explosion",
      "id": 0x3,
      "count": 8,
    }],
  },
  "ARC-12 Blitzer": {
    "count": 5,
  },
  "PLAS-1 Scorcher": {
    "projectileid": 0x5C,
  },
  "PLAS-101 Purifier": {
    "projectileid": 0x5D,
  },
  "SG-8P Punisher Plasma": {
    "projectileid": 0x24,
  },
  "G-6 Frag": {
    "subattacks": [{
      "type": "projectile",
      "id": 0x87,
      "count": 30,
    }]
  },
}

let wps = weapons.slice(1)
const seen = new Set()
wps = wps.filter(f => {
  if(seen.has(f.fullname)) {
    return false
  }
  seen.add(f.fullname)
  return true
})
wps = wps.map(wpn => {
  for(const prop of purge) {
    delete wpn[prop]
  }
  const dmgId = wpn.id
  if(dmgId) {
    delete wpn.id
    const projectile = data.projectiles.find(p => p.damageid == dmgId)
    if(projectile) {
      wpn.projectileid = projectile.id
    } else {
      wpn.damageid = dmgId
      console.error(`Projectile not found for: ${dmgId}`, wpn)
    }
  }
  const xId = wpn.xid
  if(wpn.xid) {
    const explosion = data.explosions.find(x => x.damageid == xId)
    if(explosion && !dmgId) {
      wpn.explosionid = explosion.id
    } else if (explosion) {
      wpn.subattacks = [{
        type: 'explosion',
        id: explosion.id,
      }]
    } else {
      wpn.damageid = xId
      console.error(`Explosion not found for: ${xId}`, wpn)
    }
  }
  Object.assign(wpn, overrides[wpn.fullname])
  return wpn
})

fs.writeFileSync('data/advanced.json', json({
  sources,
  weapons: wps,
}))
