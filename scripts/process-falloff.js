import fs from 'fs'
const data = fs.readFileSync('data/falloff-3.csv', 'utf8')

const [header, ...rows] = data
  .trim()
  .split('\n')
  .map(r => r.split(','))

const timestep = 1 / 60
function simulation({ cal, v, m: mass, drag }) {
  let distance = 0
  const area = Math.pow(cal * 0.01293, 2)
  for(let distance = 0; distance < 100;) {
    const dragForce = airDensity * Math.pow(v, 2) * drag * area
    const v2 = v - dragForce / mass * timestep
    if(v2 < 0) return 0
    distance += (+v + +v2) * 0.5 * timestep
    v = v2
  }
  return v
}

const hp = 20000
const base = 10000
const results = rows.map(([cal, v, m, drag, rem]) => {
  const dmg = hp - rem
  const ratio = (100 * (base - dmg) / base).toFixed(2)
  return [
    cal,
    v,
    m,
    drag,
    dmg,
    ratio,
    simulation({ cal, v, m, drag }).toFixed()
  ]
})

console.log(results.map(r => {
  const [
    cal,
    v,
    m,
    drag,
    dmg,
    ratio,
    sim,
    comment,
  ] = r
  return [
    `Cal: ${+cal}`,
    `Mass: ${+m}`,
    `Vel: ${+v}`,
    `Vel2: ${v - +(v * ratio / 100).toFixed()}`,
    `Sim: ${sim}`,
  ].map(v => v.padEnd(12)).join('')
}).join('\n'))

const output = [
  ['Caliber', 'Velocity', 'Mass', 'Drag', 'Damage', 'Falloff', 'Simulation', 'Commment'],
  ...results,
].join('\n')
// console.log(output)
