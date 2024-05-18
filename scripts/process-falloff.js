import fs from 'fs'
const data = fs.readFileSync('data/falloff-2.csv', 'utf8')

const [header, ...rows] = data
  .trim()
  .split('\n')
  .map(r => r.split(','))

const timestep = 1 / 20
function simulation({ cal, v, m: mass, drag }) {
  let distance = 0
  const airDensity = 1.293
  const area = Math.PI * Math.pow(cal * 0.01, 2)
  for(let distance = 0; distance < 100;) {
    const dragForce = airDensity * Math.pow(v, 2) * drag * area
    console.log(dragForce)
    const v2 = v - dragForce / mass * timestep
    if(v2 < 0) return 0
    distance += (+v + +v2) * 0.5 * timestep
    v = v2
  }
  return v
}

const hp = 20000
const base = 10000
const results = rows.map(([cal, v, m, drag, rem, comment]) => {
  const dmg = hp - rem
  const ratio = (100 * (base - dmg) / base).toFixed(2)
  return [
    cal,
    v,
    m,
    drag,
    dmg,
    ratio,
    simulation({ cal, v, m, drag }).toFixed(),
    comment,
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
  return {
    v: +v,
    v2: v - +(v * ratio / 100).toFixed(),
    sim: +sim,
  }
}))

const output = [
  ['Caliber', 'Velocity', 'Mass', 'Drag', 'Damage', 'Falloff', 'Simulation', 'Commment'],
  ...results,
].join('\n')
console.log(output)
