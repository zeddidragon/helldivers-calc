async function loadWeapons() {
  window.weapons = await fetch(`weapons.json`).then(res => res.json())
}

const headers =  {
  category: () => 'Type',
  rpm: () => 'RPM',
  ap: () => 'AP',
  xap: () => ' ',
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
  reload: ({ reload, reloadearly, reloadone }) => {
    if(!reload) {
      return ''
    }
    if(reloadone) {
      return `${reloadone.toFixed(1)} - ${reload.toFixed(1)}`
    }
    if(reloadearly) {
      return `${reload.toFixed(1)} / ${reloadearly.toFixed(1)}`
    }
    return reload.toFixed(1)
  },
  spare: ({ mags, magstart, clips, clipsize, rounds, roundstart }) => {
    if(magstart) {
      return `x ${magstart}/${mags}`
    } else if(mags) {
      return `x ${mags}`
    } else if(clipsize) {
      return `[${clipsize}]x ${clips}`
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
    return Math.round(dmg * rpm / 60)
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

const locals = {
  cats: [
    'category',
    'code',
    'name',
    'damage',
    'xdamage',
    'ap',
    'xap',
    'recoil',
    'rpm',
    'dps',
    'reload',
    'cap',
    'spare',
    'supply',
    'magdmg',
    'total',
  ],
  weapons: null,
  header: (cat) => {
    return headers[cat]?.(cat) || headers.default(cat)
  },
  value: (cat, wpn) => {
    return values[cat]?.(wpn) || wpn[cat]
  },
  cellClass: (cat, wpn) => {
    return classes[cat]?.(cat, wpn) || classes?.default(cat, wpn)
  },
}

function render() {
  locals.weapons = weapons
  document.querySelector('body').innerHTML = template(locals)
}

loadWeapons().then(() => render())
