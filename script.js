async function loadWeapons() {
  window.weapons = (await fetch(`data/weapons.json`).then(res => res.json()))
    .slice(1)
}
function shotDmg(wpn) {
  return ((wpn.pellets || 1) * (wpn.damage || 0)
    + (wpn.xpellets || 1) * (wpn.xdamage || 0))
}

function massDmg(wpn) {
  return ((wpn.pellets || 1) * (wpn.durable || 0)
    + (wpn.xpellets || 1) * (wpn.xdurable || 0))
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

function tdps(wpn) {
  if(!wpn.reload) {
    return
  }
  let magTime = wpn.limit
  if(wpn.rpm) {
    magTime = ((wpn.cap || 1) - 1) * 60 / wpn.rpm
  }
  if(wpn.charge) {
    magTime = wpn.charge * (wpn.cap || 1)
  }
  return magDmg(wpn) / (magTime + wpn.reload)
}

function magDmg(wpn) {
  if(!wpn.reload) {
    return 0
  }
  if(wpn.dps) {
    return (wpn.dps * wpn.limit) || 0
  }
  const dmg = shotDmg(wpn)
  if(wpn.limit) { // Sickle
    return Math.floor((dmg * wpn.rpm * wpn.limit) / 60) || 0
  }
  return (dmg * (wpn.cap || 1)) || 0
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
  durable: (a, b) => {
    return (massDmg(b) - massDmg(a)) || sorting.damage(a, b)
  },
  byCol: (col) => sortNum(col),
  ap: sortNums(['ap', 'xap'], ['max', 'min'], -1),
  effect: (a, b) => {
    const aEffect = a.effect1 || 0
    const bEffect = b.effect1 || 0
    const effectDiff = bEffect - aEffect
    if(effectDiff) return effectDiff
    if(!aEffect) {
      return sorting.damage(a, b)
    }
    const aParam = a.param1 || 0
    const bParam = b.param1 || 0
    const paramDiff = bParam - aParam
    if(paramDiff) return paramDiff
    return sorting.damage(a, b)
  },
  demo: sortNums(['demo', 'xdemo'], ['max', 'min'], -1),
  spare: sortNums(['mags', 'rounds', 'clips'], ['max', 'min'], -1),
  stun: sortNums(['stun', 'xstun'], ['max', 'min'], -1),
  push: sortNums(['push', 'xpush'], ['max', 'min'], -1),
  supply: sortNums(['supply', 'roundsupply', 'clipsupply'], ['max', 'min'], -1),
  recoil: sortNum('recoil'),
  rpm: sortNum('rpm'),
  dps: (a, b) => {
    return (dps(b) - dps(a)) || sorting.damage(a, b)
  },
  cap: (a, b) => {
    const aCapTotal = (a.cap || a.limit || 0) + (a.capplus || 0)
    const bCapTotal = (b.cap || b.limit || 0) + (b.capplus || 0)
    const aCap = (a.cap || a.limit || 0)
    const bCap = (b.cap || b.limit || 0)
    return (bCapTotal - aCapTotal) || (bCap || aCap) || sorting.damage(a, b)
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
  demo: () => 'Demo',
  durable: () => 'Durable',
  supply: () => 'Pickup',
  unknown4: () => 'i4',
  unknown5: () => 'i5',
  unknown6: () => 'i6',
  float1: () => 'f1',
  float2: () => 'f2',
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
  'polar-pat',
  'support',
]
const sourceLabels = {
  'dlc-super': 'DLC',
  'start': 'Start',
  'hd-mobilize': 'Hell',
  'steel-vets': 'Vets',
  'cut-edge': 'Cut',
  'demo-det': 'Demo',
  'polar-pat': 'Polar',
  'support': '',
}
const sourceNames = {
  'dlc-super': 'DLC: Super Citizen',
  'start': 'Starting Equipment',
  'hd-mobilize': 'Helldivers: Mobilize',
  'steel-vets': 'Steeled Veterans',
  'cut-edge': 'Cutting Edge',
  'demo-det': 'Democratic Detonation',
  'polar-pat': 'Polar Patriots',
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

const cols = [
  'source',
  'category',
  'code',
  'name',
  'damage',
  'durable',
  'ap',
  'effect',
  'demo',
  'stun',
  'push',
  'recoil',
  'rpm',
  'reload',
  'cap',
  'spare',
  'supply',
  'dps',
  'tdps',
  'magdmg',
  'total',
]
const nerdCols = [
  'category',
  'fullname',
  'id',
  'damage',
  'durable',
  'ap',
  'ap2',
  'ap3',
  'ap4',
  'demo',
  'stun',
  'push',
  'dmgtype',
  'effect1',
  'param1',
  'effect2',
  'param2',
]

const effectCache = {}

function getEffect(wpn, p) {
  const effectId = wpn[p.prop]
  const param = wpn[p.vProp]
  const key = `${effectId}|${param}`
  if(effectCache[key]) {
    return effectCache[key]
  }
  switch(effectId) {
    case 6:
      effectCache[key] = {
        name: () => '🔥',
        value: () => param,
        description: () => `${param} (chance%/buildup?) for setting target on fire`,
      }
      break
    case 34:
      effectCache[key] = {
        name: () => '☆',
        value: () => param,
        description: () => `Stuns target. Buildup factor of ${param}.`,
      }
      break
    default:
      effectCache[key] = {
        name: () => `???`,
        value: () => param,
        description: () => `Unknown effect #${effectId} (${param}`,
      }
      break
  }
  return effectCache[key]
}

const locals = {
  weapons: null,
  nerdMode: false,
  sortBy: 'category',
  getWeapons: () => {
    const sorter = sorting[locals.sortBy] || sorting.byCol(locals.sortBy)
    return weapons
      .filter(wpn => !locals.hideSources[wpn.source])
      .filter(wpn => !locals.hideCategories[wpn.category])
      .sort(sorter)
  },
  dmgTypeText: wpn => {
    switch(wpn.dmgtype) {
      case 1: return 'Fire Damage'
      case 2: return 'Arc Damage'
    }
  },
  dmgTypeClass: wpn => {
    switch(wpn.dmgtype) {
      case 1: return 'fire'
      case 2: return 'arc'
    }
  },
  dmgType: wpn => {
    switch(wpn.dmgtype) {
      case 1: return '🔥'
      case 2: return '⚡'
      default: return wpn.dmgType
    }
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
  cols: () => locals.nerdMode ? nerdCols : cols,
  nerdValue: (col, wpn, prefix='') => {
    if(prefix && col === 'fullname') {
      return `${wpn.name} (AoE)`
    }
    return wpn[`${prefix}${col}`]
  },
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
  colSpan: (col) => {
    return {
      cap: 2,
    }[col]
  },
  effectParams: [{
    prop: 'effect1',
    vProp: 'param1',
  }, {
    prop: 'effect2',
    vProp: 'param2',
  }, {
    prop: 'xeffect1',
    vProp: 'xparam1',
  }, {
    prop: 'xeffect2',
    vProp: 'xparam2',
  }],
  effectDescription: (wpn, p) => {
    const effect = getEffect(wpn, p)
    return effect.description()
  },
  effectName: (wpn, p) => {
    const effect = getEffect(wpn, p)
    return effect.name()
  },
  effectValue: (wpn, p) => {
    const effect = getEffect(wpn, p)
    return effect.value()
  },
  hasTag: (wpn, tag) => {
    return wpn.tags?.includes(tag)
  },
  dps: wpn => Math.round(dps(wpn)) || '',
  tdps: wpn => Math.round(tdps(wpn)) || '',
  magDmg,
  totalDmg,
  wikiLink: (wpn) => {
    const url = 'https://helldivers.wiki.gg/wiki'
    const path = wpn.fullname.split(/\s+/).join('_')
    return `${url}/${path}`
  },
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

let doubleClickTime = 500
let lastToggleTime = 0
let lastToggleItem
function toggleAction({
  item,
  items,
  register,
}) {
  register[item] = !register[item]
  const now = Date.now()
  const diff = now - lastToggleTime
  const isItem = lastToggleItem === item
  lastToggleItem = item
  lastToggleTime = now
  const isDoubleClick = isItem && diff < doubleClickTime
  const toggled = items
    .filter(s => register[s])

  if(toggled.length === items.length) {
    for(const k of items) {
      register[k] = false
    }
  } else if(isDoubleClick) {
    for(const k of items) {
      register[k] = true
    }
    register[item] = false
  }
  render()
}

window.toggleSource = function toggleSource(source) {
  toggleAction({
    item: source,
    items: sourceOrder,
    register: locals.hideSources,
  })
}

window.toggleCategory = function toggleCategory(cat) {
  toggleAction({
    item: cat,
    items: locals.cats,
    register: locals.hideCategories,
  })
}

window.toggleNerdMode = function toggleNerdMode() {
  const checkbox = document.getElementById('nerd-mode')
  locals.nerdMode = checkbox.checked
  render()
}

loadWeapons().then(() => render())
