import fs from 'fs'
import { fileURLToPath } from "url"

const data = JSON.parse(fs.readFileSync('./data/datamined.json'))

const typical = [
  'damage',
  'pen1',
  'nothirddefault'
]

const filters = {
  range: (prop, min, max) => {
    return (dmg) => min <= dmg[prop] && dmg[prop] <= max 
  },
  set: (prop, values) => {
    values = values.map(v => +v)
    return (dmg) => values.includes(dmg[prop])
  },
  equals: (prop, val) => {
    return (dmg) => dmg[prop] === +val
  },
}
const comparators = Object.keys(filters)

export function search(args) {
  let filtered = data.item.slice()
  let i = 0
  for(const arg of args) {
    let [prop, val] = arg.split('=')
    if(!val) {
      val = prop
      prop = typical[i]
    }
    if(!prop) {
      throw new Error(`Argument ${i} not parsed: "${arg}"`)
    }
    let filter
    if(val.includes('-')) {
      const vals = val.split('-')
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      filter = filters.range(prop, min, max)
    } else if(val.includes(',')) {
      filter = filters.set(prop, val.split(','))
    } else {
      filter = filters.equals(prop, val)
    }
    filtered = filtered.filter(filter)
    if(!filter.length) return 'no matches'
    i++
  }
  return filtered.map(w => {
    return [
      `#${w.id}:`,
      `${w.damage}/${w.secondaryDamage}`,
      `${w.pen1}/${w.pen2}/${w.pen3}/${w.pen4}`,
      `${w.demolition}/${w.stun}/${w.push}`,
      `${w.unknown4}/${w.unknown5}(${w.float1})/${w.unknown6}(${w.float2})`,
    ].join(' ')
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(search(process.argv.slice(2)).join('\n'))
}

