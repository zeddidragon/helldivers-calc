import fs from 'fs'
import pug from 'pug'

const compiler = pug.compileFile('./template.pug', {
  pretty: true,
})
const file = fs.readFileSync('./weapons.json', 'utf-8').trim()
function frames(stamp) {
  if(!stamp || stamp === '') {
    return 
  }
  const values = stamp.split(':')
  return values
    .map((v, i) => Math.pow(60, values.length - i - 1) * v)
    .reduce((sum, v) => sum + v, 0)
}
const reloads = fs.readFileSync('./reloads.csv', 'utf-8').trim()
  .split('\n')
  .slice(1)
  .map(r => r.split(','))
  .map(([name, rStart, rEnd, eStart, eEnd]) => {
    return {
      name,
      reload: Math.round((frames(rEnd) - frames(rStart)) / 6) / 10,
      reloadEarly: eStart && Math.round((frames(eEnd) - frames(eStart)) / 6) / 10,
    }
  })
const weapons = JSON.parse(file)
console.log('hello')
console.log(reloads)


function honk() {
const headers =  {
  rpm: () => 'RPM',
  ap: () => 'AP',
  damage: () => 'Dmg',
  xdamage: () => 'xDmg',
  supply: () => 'Pickup',
  magdmg: () => 'Mag',
  total: () => 'Total',
  default: cat => {
    return cat[0].toUpperCase() + cat.slice(1)
  },
}

const classes = {
  ap: (cat, { ap }) => {
    return [cat, `ap-${ap}`]
  },
  xap: (cat, { xap }) => {
    if(xap) {
      return [cat, `ap-${xap}`]
    }
    return cat
  },
  category: (cat, { category }) => {
    return [cat, category.split(/\s+/g).join('-').toLowerCase()]
  },
  default: (cat) => {
    return cat
  },
}

const values = {
  code: ({ name }) => {
    return name.split(/\s+/)[0]
  },
  name: ({ name }) => {
    return name.split(/\s+/).slice(1).join(' ')
  },
  spare: ({ mags, magstart, clips, rounds, roundstart }) => {
    if(magstart) {
      return `x ${magstart}/${mags}`
    } else if(mags) {
      return `x ${mags}`
    } else if(clips) {
      return `x/2 ${clips}`
    } else if(roundstart) {
      return `+ ${roundstart}/${rounds}`
    } else if(rounds) {
      return `+ ${rounds}`
    } else {
      return ''
    }
  },
  xdamage: ({ xdamage }) => {
    if(xdamage) {
      return `+ ${xdamage}`
    }
    return null
  },
  cap: ({ cap, limit }) => {
    if(cap) {
      return cap
    }
    if(limit) {
      return `${limit}s`
    }
  },
  dps: ({ damage, xdamage, cap, rpm, dps }) => {
    if(dps) {
      return dps
    }
    if(cap === 1) {
      return ''
    }
    if(!rpm) {
      return ''
    }
    const dmg = (damage || 0) + (xdamage || 0)
    return (dmg * rpm / 60).toFixed(1)
  },
  box: ({ box, clipbox }) => {
    if(box) {
      return box
    }
    if(clipbox) {
      return `${clipbox}/2`
    }
    return ''
  },
  supply: ({ box, supply, clipbox, clipsupply, roundsbox, roundsupply }) => {
    if(supply) {
      return `${supply}/${box}`
    }
    if(roundsupply) {
      return `${roundsupply}/${roundsbox}`
    }
    if(clipsupply) {
      return `${clipsupply}/${clipbox}`
    }
    return ''
  },
  magdmg: ({ damage, xdamage, dps, rpm, cap, limit }) => {
    if(dps) {
      return dps * limit
    }
    const dmg = (damage || 0) + (xdamage || 0)
    if(limit) { // Sickle
      return Math.floor((dmg * rpm * limit) / 60)
    }
    return dmg * cap
  },
  total: ({ damage, xdamage, dps, rpm, cap, limit, mags, clips, rounds }) => {
    if(dps) {
      return dps * limit * (mags + 1)
    }
    const dmg = (damage || 0) + (xdamage || 0)
    if(limit) { // Sickle
      return Math.floor((dmg * rpm * limit) / 60) * (mags + 1)
    }
    if(rounds) {
      return damage * (cap + rounds)
    }
    if(clips) {
      return damage * (cap + cap * clips * 0.5)
    }
    return dmg * cap * (mags + 1)
  },
}

console.log(compiler({
  cats: [
    'category',
    'code',
    'name',
    'damage',
    'xdamage',
    'ap',
    'xap',
    'cap',
    'recoil',
    'rpm',
    'dps',
    'reload',
    'spare',
    'supply',
    'magdmg',
    'total',
  ],
  weapons,
  header: (cat) => {
    return headers[cat]?.(cat) || headers.default(cat)
  },
  value: (cat, wpn) => {
    return values[cat]?.(wpn) || wpn[cat]
  },
  cellClass: (cat, wpn) => {
    return classes[cat]?.(cat, wpn) || classes?.default(cat, wpn)
  },
}))
}
