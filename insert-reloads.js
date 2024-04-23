import fs from 'fs'

function frames(stamp) {
  if(!stamp || stamp === '') {
    return 
  }
  const values = stamp.split(':')
  return values
    .map((v, i) => Math.pow(60, values.length - i - 1) * v)
    .reduce((sum, v) => sum + v, 0)
}

const weapons = JSON.parse(fs.readFileSync('./weapons.json', 'utf-8').trim())
const reloads = fs.readFileSync('./reloads.csv', 'utf-8').trim()
  .split('\n')
  .slice(1)
  .map(r => r.split(','))
  .map(([name, rStart, rEnd, eStart, eEnd]) => {
    return {
      name,
      reload: Math.round((frames(rEnd) - frames(rStart)) / 6) / 10,
      reloadearly: eStart && Math.round((frames(eEnd) - frames(eStart)) / 6) / 10,
    }
  })

const register = {}
for(const r of reloads) {
  register[r.name] = r
}
for(const wpn of weapons) {
  const r = register[wpn.name]
  if(!wpn.source) {
    wpn.source = 'support'
  }
  if(r) {
    wpn.reload = r.reload
    if(r.reloadearly && r.reloadearly !== r.reload) {
      wpn.reloadearly = r.reloadearly
    }
  }
  if(wpn.reloadearly && wpn.rounds) {
    wpn.reloadone = wpn.reloadearly
    delete wpn.reloadearly
  }
}

fs.writeFileSync('weapons.json', JSON.stringify(weapons, null, 2))
