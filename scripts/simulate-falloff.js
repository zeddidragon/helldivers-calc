import fs from 'fs'
const falloffData = fs.readFileSync('data/falloff.csv', 'utf8')
const rawData = JSON.parse(fs.readFileSync('data/datamined.json', 'utf8'))
const weaponData = JSON.parse(fs.readFileSync('data/weapons.json', 'utf8'))

const [header, ...rows] = falloffData
  .trim()
  .split('\n')
  .map(r => r.split(','))

const timestep = 1 / 512
function simulation({ cal, v, m: mass, drag, er = 1 }) {
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
  const fixed = baseDmg * (1 - er)
  const eBased = baseDmg * er
  console.log({ fixed, eBased })
  return Math.floor(fixed + eBased * energy / baseEnergy)
}

function register(arr, prop = 'id') {
  const obj = {}
  for(const v of arr) {
    obj[v[prop]] = v
  }
  return obj
}

const weapons = register(weaponData.weapons, 'fullname')
const bullets = register(rawData.projectiles, 'enum')

const results = rows.map(([name, range, base, hp, rem]) => {
  const weapon = weapons[name]
  console.log(name)
  const bullet = bullets[weapon.attack[0].ref]
  console.log(bullet.enum)
  const dmg = hp - rem
  const ratio = (100 * (base - dmg) / base).toFixed(2)
  const {
    caliber: cal,
    velocity: v,
    mass: m,
    drag,
    unk47: er, // Energy Ratio
  } = bullet
  return [
    name.padEnd(30),
    cal,
    v,
    m,
    drag,
    dmg,
    ratio,
    er,
    simulation({ cal, v, m, drag, er }).toFixed()
  ]
  
})

console.log(results.map(r => {
  const [
    name,
    cal,
    v,
    m,
    drag,
    dmg,
    ratio,
    er,
    sim,
    comment,
  ] = r
  return [
    name,
    `Cal: ${+cal}`,
    `Mass: ${+m}`,
    `Drag ${drag}`,
    `Vel: ${+v}`,
    `f47: ${er}`,
    `Dmg: ${dmg}`,
    `Sim: ${sim}`,
  ].map(v => v.padEnd(12)).join('')
}).join('\n'))

const output = [
  ['Caliber', 'Velocity', 'Mass', 'Drag', 'Damage', 'Falloff', 'Simulation', 'Commment'],
  ...results,
].join('\n')
// console.log(output)
// */
