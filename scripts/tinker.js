import fs from 'fs'

const {
  item: damages,
} = JSON.parse(fs.readFileSync('./data/datamined.json', 'utf-8').trim())
const damageRegister = {}
for(const dmg of damages) {
  damageRegister[dmg.id] = dmg
}

const mappings = fs.readFileSync('./data/id-mapping.csv', 'utf8')
  .split('\n')
  .slice(1)
  .map(m => {
    const [name, prop, id] = m.split(',')
    const dmg = damageRegister[id]
    return [
      name,
      prop,
      [
        dmg.damage,
        dmg.pen1,
        prop === 'xdamage' && 'pen2=0',
        `unknown4=${dmg.unknown4}`
      ].filter(v => v).join(' ')
    ].join(',')
  })
  .join('\n')
console.log('name,property,search')
console.log(mappings)
