async function loadWeapons() {
  window.weapons = await fetch(`weapons.json`).then(res => res.json())
}

function shotDmg(wpn) {
  return (wpn.damage || 0) + (wpn.xdamage || 0)
}

function dps(wpn) {
  if(wpn.dps) {
    return wpn.dps
  }
  if(wpn.cap === 1) {
    return 0
  }
  if(!wpn.rpm) {
    return 0
  }
  return shotDmg(wpn) * wpn.rpm / 60
}

function magDmg(wpn) {
  if(wpn.dps) {
    return (wpn.dps * wpn.limit) || 0
  }
  const dmg = shotDmg(wpn)
  if(wpn.limit) { // Sickle
    return Math.floor((dmg * wpn.rpm * wpn.limit) / 60) || 0
  }
  return (dmg * wpn.cap) || 0
}

function totalDmg(wpn) {
  if(wpn.dps) {
    return (wpn.dps * wpn.limit * (wpn.mags + 1)) || 0
  }
  const dmg = shotDmg(wpn)
  if(wpn.limit) { // Sickle
    return Math.floor((dmg * wpn.rpm * wpn.limit) / 60) * (wpn.mags + 1) || 0
  }
  if(wpn.rounds) {
    return dmg * (wpn.cap + wpn.rounds) || 0
  }
  if(wpn.clips) {
    return dmg * (wpn.cap + wpn.clipsize * wpn.clips) || 0
  }
  return dmg * wpn.cap * ((wpn.mags || 0) + 1) || 0
}

function sortText(prop) {
  return function(a, b) {
    return (a[prop] || '').localeCompare(b[prop] || '')
  }
}

function sortNum(prop, {
  fallback = 0,
} = {}) {
  return function(a, b) {
    return (b[prop] || fallback) - (a[prop] || fallback)
  }
}

function sortNums(props, {
  maths = ['max', 'min'],
  order = -1,
} = {}) {
  return function(a, b) {
    for(const math of maths) {
      const valA = Math[math](...props.map(p => a[p] || 0))
      const valB = Math[math](...props.map(p => b[p] || 0))
      const diff = (valA - valB) * order
      if(diff) {
        return diff
      }
    }
    return sorting.damage(a, b)
  }
}

const sorting = {
  source: (a, b) => {
    const aSource = sourceOrder.indexOf(a.source)
    const bSource = sourceOrder.indexOf(b.source)
    const sourceDiff = aSource - bSource
    if(sourceDiff) return sourceDiff
    const pageDiff = a.sourcepage - b.sourcepage
    if(pageDiff) return pageDiff
  },
  code: sortText('code'),
  name: sortText('name'),
  damage: (a, b) => {
    return (shotDmg(b) - shotDmg(a)) || sorting.code(a, b)
  },
  ap: sortNums(['ap', 'xap'], ['max', 'min'], -1),
  spare: sortNums(['mags', 'rounds', 'clips'], ['max', 'min'], -1),
  supply: sortNums(['supply', 'roundsupply', 'clipsupply'], ['max', 'min'], -1),
  recoil: sortNum('recoil'),
  rpm: sortNum('rpm'),
  dps: (a, b) => {
    return (dps(b) - dps(a)) || sorting.damage(a, b)
  },
  cap: (a, b) => {
    const aCap = (a.cap || a.limit || 0)
    const bCap = (b.cap || b.limit || 0)
    return (bCap - aCap) || sorting.damage(a, b)
  },
  magdmg: (a, b) => {
    return (magDmg(b) - magDmg(a)) || sorting.default(a, b)
  },
  total: (a, b) => {
    return (totalDmg(b) - totalDmg(a)) || sorting.default(a, b)
  },
  reload: sortNums(['reloadearly', 'reload']),
  default: (a, b) => {
    return (a.catIdx - b.catIdx) || (a.idx - b.idx)
  },
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
  source: (cat, { source }) => {
    return [cat, source]
  },
  default: (cat) => {
    return cat
  },
}

const sourceOrder = [
  'dlc-super',
  'start',
  'hd-mobilize',
  'steel-vets',
  'cut-edge',
  'demo-det',
  'support',
]
const sourceLabels = {
  'dlc-super': 'DLC',
  'start': 'Start',
  'hd-mobilize': 'Hell',
  'steel-vets': 'Vets',
  'cut-edge': 'Cut',
  'demo-det': 'Demo',
  'support': '',
}
const sourceNames = {
  'dlc-super': 'DLC: Super Citizen',
  'start': 'Starting Equipment',
  'hd-mobilize': 'Helldivers: Mobilize',
  'steel-vets': 'Steeled Veterans',
  'cut-edge': 'Cutting Edge',
  'demo-det': 'Democratic Detonation',
  'support': 'Support Weapon',
}
const categoryNames = {
  'AR': 'Assault Rifle',
  'DMR': 'Designated Marksman Rifle',
  'SMG': 'Submachine Gun',
  'SG': 'Shotgun',
  'EX': 'Explosive / Rocket',
  'NRG': 'Energy-Based',
  'HG': 'Sidearm',
  'SUP': 'Support Weapon',
}

const values = {
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
}

const locals = {
  weapons: null,
  sortBy: 'category',
  getWeapons: () => {
    const sorter = sorting[locals.sortBy] || sorting.default
    return weapons
      .filter(wpn => !locals.hideSources[wpn.source])
      .filter(wpn => !locals.hideCategories[wpn.category])
      .sort(sorter)
  },
  hideSources: {},
  hideCategories: {},
  sourceLabels,
  sourceOrder,
  sourceFull: (wpn) => {
    const desc = sourceNames[wpn.source]
    if(wpn.sourcepage) {
      return `${desc}, page ${wpn.sourcepage}`
    }
    return desc
  },
  categoryFull: (wpn) => {
    return categoryNames[wpn.category]
  },
  cats: Object.keys(categoryNames),
  cols: [
    'source',
    'category',
    'code',
    'name',
    'damage',
    'ap',
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
  sourceClass: (source) => {
    return [
      source,
      locals.hideSources[source] ? 'hidden' : '',
    ]
  },
  catClass: (cat) => {
    return [
      cat,
      locals.hideCategories[cat] ? 'hidden' : '',
    ]
  },
  colClass: (col) => {
    return [
      col,
      locals.sortBy === col ? 'sorting' : '',
    ]
  },
  hasTag: (wpn, tag) => {
    return wpn.tags?.includes(tag)
  },
  dps: wpn => Math.round(dps(wpn)) || '',
  magDmg,
  totalDmg,
  header: (col) => {
    return headers[col]?.(col) || headers.default(col)
  },
}

function render() {
  locals.weapons = weapons
  document.querySelector('body').innerHTML = template(locals)
}

window.sortBy = function sortBy(cat) {
  locals.sortBy = cat
  render()
}

window.toggleSource = function toggleSource(source) {
  locals.hideSources[source] = !locals.hideSources[source]
  render()
}

window.toggleCategory = function toggleCategory(cat) {
  locals.hideCategories[cat] = !locals.hideCategories[cat]
  render()
}

loadWeapons().then(() => render())
