import fs from 'fs'

const data = fs.readFileSync('data/damage-tests.txt', 'utf8')

const hp = 125
const limbs = {
  Head: 2,
  Chest: 0.85,
  Arm: 0.7,
  Leg: 0.8,
}
const armors = {
  50: 1.33,
  64: 1.235354,
  70: 1.198,
  79: 1.141428,
  100: 1,
  129: 0.885714,
  150: 0.8,
  200: 0.67,
}

let armor = 0
for(const line of data.split('\n')) {
  const header = /(Light|Medium|Heavy) \((\d+)\)/.exec(line)
  if(header) {
    armor = +header[2]
    continue
  }
  const domHit = /Dom (Head|Chest|Arm|Leg): (-?\d+)/.exec(line)
  if(domHit) {
    const base = 275
    const [, limb, rem] = domHit
    const damage = Math.abs(hp - rem)
    const fraction = (damage / limbs[limb]) / base
    console.log({ armor, limb, fraction })
  }
  const grenade10k = /10k Grenade: (-?\d+)/.exec(line)
  if(grenade10k) {
    const base = 10000
    const [, rem] = grenade10k
    const damage = Math.abs(hp - rem)
    const fraction = damage / base
    console.log({ source: '10k', armor, fraction })
  }
}

function pct(v) {
  return (100 * v).toFixed(2) + '%'
}
const headers = ['Armor', 'Overall', 'Explosion', 'Fortified', ...Object.keys(limbs)]
const tables = []
for(const vitality of [1, 0.8]) {
  const rows = []
  if(vitality === 1) {
    rows.push(headers)
  } else if(vitality < 1) {
    rows.push(['w/Vitality', ...headers.slice(1)])
  }
  for(const [armor, overall] of Object.entries(armors)) {
    const row = [armor, ...[1, 0.5, 0.25].map(x => pct(overall * vitality * x))]
    for(const [limb, multi] of Object.entries(limbs)) {
      let base = overall
      if(limb === 'Head' && armor <= 100) {
        base = 1.0
      }
      row.push(pct(base * multi * vitality))
    }
    rows.push(row)
  }
  tables.push(rows)
}


console.log(tables)
const csv = tables.flatMap(t => t.join('\n')).join('\n\n')
fs.writeFileSync('data/armor-values.csv', csv)

const md = tables.map(([headers, ...rows]) => {
  return [
    headers,
    headers.map(h => ':-'),
    ...rows,
  ].map(r => `|${r.join('|')}|`).join('\n')
}).join('\n\n')
fs.writeFileSync('data/armor-values.md', md)
