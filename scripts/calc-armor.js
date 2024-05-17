import fs from 'fs'

const data = fs.readFileSync('data/damage-tests.txt', 'utf8')

const hp = 125
const limbs = {
  Head: 2,
  Chest: 0.85,
  Arm: 0.7,
  Leg: 0.8,
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
}

const armors = {
  50: 1.33,
  64: 1.236,
  70: 1.2,
  79: 1.14,
  100: 1.0,
  150: 0.8,
}

const headers = ['Armor', 'Overall', ...Object.keys(limbs)]
const rows = []
for(const [armor, overall] of Object.entries(armors)) {
  const row = [armor]
  for(const [limb, multi] of Object.entries(limbs)) {
    let base = overall
    if(limb === 'Head' && armor <= 100) {
      base = 1.0
    }
    row.push(`${(100 * base * multi).toFixed()}%`)
  }
  rows.push(row)
}
console.log([headers, ...rows].join('\n'))
