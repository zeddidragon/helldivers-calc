import fs from 'fs'
import { fileURLToPath } from "url"

const { strikes } = JSON.parse(fs.readFileSync('./data/datamined.json'))

const typical = [
  'dmg',
  'ap1',
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
  let filtered = strikes.slice()
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
      `${w.dmg}/${w.mass}`,
      `${w.ap1}/${w.ap2}/${w.ap3}/${w.ap4}`,
      `${w.demo}/${w.stun}/${w.push}`,
      `${w.type}/${w.func1}(${w.param1})/${w.func2}(${w.param2})`,
    ].join(' ')
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(search(process.argv.slice(2)).join('\n'))
}

