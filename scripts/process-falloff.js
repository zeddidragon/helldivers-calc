import fs from 'fs'
const data = fs.readFileSync('data/falloff-3.csv', 'utf8')

const [header, ...rows] = data
  .trim()
  .split('\n')
  .map(r => r.split(','))

const timestep = 1 / 512
function simulation({ cal, v, m: mass, drag }) {
  let distance = 0
  mass = mass / 1000
  cal = cal / 1000
  const baseEnergy = v * v / mass
  const cb = (cal ** 2) * drag / mass
  const area = (Math.PI * (cal * 0.5) ** 2)
  for(let distance = 0; distance < 100;) {
    const dragForce = 0.5 * (v ** 2) * cb
    const v2 = v - 0.5 * dragForce * timestep
    if(v2 < 0.1) return 0
    distance += (+v + +v2) * 0.5 * timestep
    v = v2
  }
  const energy = v * v / mass
  const baseDmg = 10000
  return Math.floor(baseDmg * energy / baseEnergy)
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
    `Drag ${drag}`,
    `Vel: ${+v}`,
    `Dmg: ${dmg}`,
    `Sim: ${sim}`,
  ].map(v => v.padEnd(12)).join('')
}).join('\n'))

const output = [
  ['Caliber', 'Velocity', 'Mass', 'Drag', 'Damage', 'Falloff', 'Simulation', 'Commment'],
  ...results,
].join('\n')
// console.log(output)
