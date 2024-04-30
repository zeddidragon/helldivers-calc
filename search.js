import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./data/datamined.json'))

const typical = [
  'damage',
  'pen1',
]
const search = process.argv
  .slice(2)
  .map(v => v.split('='))
  .map(([k, v], i) => {
    if(!v) {
      return {
        k: typical[i],
        v: +k,
      }
    }
    return { k, v: +v }
  })
for(const w of data.item) {
  let isFit = true
  for(const { k, v } of search) {
    if(w[k] !== v) {
      isFit = false
      break
    }
  }
  if(!isFit) {
    continue
  }
  console.log([
    `#${w.id}:`,
    `${w.damage}/${w.secondaryDamage}`,
    `${w.pen1}/${w.pen2}/${w.pen3}/${w.pen4}`,
    `${w.unknown1}/${w.stun}/${w.push}`,
  ].join(' '))
}
