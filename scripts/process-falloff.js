import fs from 'fs'
const data = fs.readFileSync('data/falloff-2.csv', 'utf8')

const [header, ...rows] = data
  .trim()
  .split('\n')
  .map(r => r.split(','))
console.log(header, rows)

const hp = 20000
const base = 10000
const results = rows.map(([cal, v, m, drag, rem, comment]) => {
  const dmg = hp - rem
  const ratio = (100 * (base - dmg) / base).toFixed(2)
  const simulation = (2 * Math.PI * cal * cal * drag / m)
  return [
    cal,
    v,
    m,
    drag,
    dmg,
    `${ratio}%`,
    simulation.toFixed(2),
    comment,
  ]
})


const output = [
  ['Caliber', 'Velocity', 'Mass', 'Drag', 'Damage', 'Falloff', 'Simulation', 'Commment'],
  ...results,
].join('\n')
console.log(output)
