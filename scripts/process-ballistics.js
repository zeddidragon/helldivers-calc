import fs from 'fs'

const nameRex = /([\W|\w]+)\W+\(w\/ (\d+\.?\d*)x(\d+\.?\d*)mm ([\W|\w/]+)\)/
const data = fs.readFileSync('data/ballistics.txt', 'utf8')

const headers = [
  'Weapon',
  'Ammo',
  'Caliber',
  'Velocity',
  'Mass',
  'Drag',
  'Gravity',
  'Life',
  'HitSlow',
]

const csv = [headers]

for(const line of data.trim().split('\n').slice(1)) {
  const [
    weaponWithAmmo,
    stats
  ] = line.split('\t')
  if(!stats) {
    continue
  }
  const [
    ,
    name,
    height,
    length,
    ammoName,
  ] = nameRex.exec(weaponWithAmmo) || [, weaponWithAmmo]
  const [
    ,
    caliber,
    velocity,
    mass,
    drag,
    gravity,
    life,
    penSlow,
  ] = stats.split(/\//)
  const ammo = ammoName ? `${height}x${length}mm ${ammoName}` : ''
  csv.push([
    name,
    ammo,
    caliber,
    velocity,
    mass,
    drag,
    gravity,
    life,
    penSlow,
  ].map(v => v?.trim() || ''))
}

fs.writeFileSync('data/ballistics.csv', csv.map(r => r.join(',')).join('\n'))
