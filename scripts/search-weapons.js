import fs from 'fs'
import { search } from './search.js'

const searches = fs.readFileSync('./data/id-search.csv', 'utf8')
  .split('\n')
  .slice(1)
for(const line of searches) {
  const [name, prop, query] = line.split(',')
  if(!query) continue
  const dmgs = search(query.split(/\s+/))
  console.log([
    name,
    prop,
    dmgs[0]?.split(':')?.[0]?.slice(1) || 'No match',
  ].join(','))
  console.log(dmgs.join('\n'))
}
