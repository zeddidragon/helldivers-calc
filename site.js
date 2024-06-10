function val(obj, prop) {
  return obj?.[prop] || 0
}

function sorting(col, mainScope) {
  let dir = -1
  if(col === 'category') {
    col = 'idx'
  }
  if(col === 'stratcode') {
    col = 'stratorder'
  }
  if(['idx', 'id', 'damageid', 'code', 'name', 'source', 'stratorder'].includes(col)) {
    dir = 1
  }

  function idxSort(a, b) {
    return a.idx - b.idx
  }

  if(locals.scope === 'weapons' && mainScope === 'projectile' && col === 'name') {
    return function sortByProjectileName(a, b) {
      const diff = (a.projectile?.[col] || '').localeCompare(b.projectile?.[col] || '') * dir
      if(diff) return diff
      return idxSort(a, b)
    }
  }
  if(locals.scope === 'weapons' && mainScope === 'projectile') {
    return function sortByProjectileCol(a, b) {
      const diff =  compare(a.projectile, b.projectile, col)
      // const diff = (a.projectile?.[col] || '').localeCompare(b.projectile?.[col] || '') * dir
      if(diff) return diff
      return idxSort(a, b)
    }
  }
  if(locals.scope === 'stratagems' && col === 'radius') {
    return function stratRadiusSort(a, b) {
      for(let i = 1; i <= 3; i++) {
        const diff = compare(a, b, `maxRadius${i}`)
        if(diff) return diff
      }
      return idxSort(a, b)
    }
  }

  let shouldSubSort = false
  if(locals.scope !== 'damages' && mainScope === 'damage') {
    shouldSubSort = true
  }
  if(locals.scope === 'stratagems' && mainScope === 'explosions') {
    shouldSubSort = true
  }
  if(shouldSubSort) {
    const cb = sorting(col)
    return function subSort(a, b) {
      const diff = cb(a.damage || {}, b.damage || {})
      if(diff) return diff
      return idxSort(a, b)
    }
  }

  if(col === 'name' || col === 'code' || col == 'stratorder') {
    return function sortByName(a, b) {
      const diff = (a[col] || '').localeCompare(b[col] || '') * dir
      if(diff) return diff
      const enumDiff = (a.enum || '').localeCompare(b.enum || '') * dir
      if(enumDiff) return enumDiff
      return idxSort(a, b)
    }
  }

  function compare(a, b, prop) {
    return (val(a, prop) - val(b, prop)) * dir
  }

  if(col === 'source') {
    return function sourceSort(a, b) {
      return compare(a, b, 'sourceidx') || compare(a, b, 'sourcepage') || idxSort(a, b)
    }
  }
  if(col === 'damage') {
    return function dmgSort(a, b) {
      return compare(a, b, 'shotdmg') || compare(a, b, 'shotdmg2') || idxSort(a, b)
    }
  }
  if(col === 'dmg') {
    return function dmgSort(a, b) {
      return compare(a, b, 'dmg') || compare(a, b, 'dmg2') || idxSort(a, b)
    }
  }
  if(col === 'rpm') {
    return function dmgSort(a, b) {
      return (effectiveRpm(a) - effectiveRpm(b)) * dir || idxSort(a, b)
    }
  }
  if(col === 'ap') {
    return function apSort(a, b) {
      for(let i = 1; i <= 4; i++) {
        const diff = compare(a, b, `ap${i}`)
        if(diff) return diff
      }
      return idxSort(a, b)
    }
  }
  if(col === 'radius') {
    return function radiusSort(a, b) {
      for(let i = 1; i <= 3; i++) {
        const diff = compare(a, b, `r${i}`)
        if(diff) return diff
      }
      return idxSort(a, b)
    }
  }
  if(col === 'effect') {
    return function apSort(a, b) {
      for(let i = 1; i <= 4; i++) {
        const eDiff = compare(a, b, `func${i}`)
        if(eDiff) return eDiff
        const pDiff = compare(a, b, `param${i}`)
        if(pDiff) return pDiff
      }
      return idxSort(a, b)
    }
  }
  return function defaultSort(a, b) {
    return compare(a, b, col) || idxSort(a, b)
  }
}

function effectiveRpm(wpn) {
  if(wpn.tags?.includes('laser')) {
    return Infinity
  }
  if(wpn.rpm) {
    return wpn.rpm
  }
  if(wpn.charge) {
    return 60 / wpn.charge
  }
  if(wpn.reload) {
    return 60 / wpn.reload
  }
  return 0
}

function charged(wpn, val) {
  return Math.floor(val * wpn.chargefactor)
}

function hasTag(wpn, tag) {
  return wpn?.tags?.includes(tag)
}

function isDps(wpn) {
  return hasTag(wpn, 'laser')
}

window.translations = {}

function sorted(arr) {
  return arr.sort(sorting(locals.sorting, locals.mainSorting))
}

window.locals = {
  get nerdMode() {
    return locals.scope !== 'weapons'
  },
  get subScope() {
    switch(locals.scope) {
      case 'projectiles':
      case 'explosions':
      case 'beams':
      case 'arcs':
        return 'damages'
    }
  },
  sorting: 'idx',
  lang: 'en',
  langs: [
    'en',
    'ru',
  ],
  colspans: {
    damages: 5,
    damagesHideName: 20,
    weapons: 11,
    explosions: 3,
    projectiles: 8,
  },
  full: {
    full: true,
  },
  hideName: {
    full: true,
    hideName: true,
    hideId: true,
  },
  count: (wpn) => {
    if(wpn.count) {
      return wpn.count
    }
    return wpn.projectile?.pellets
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
  headerClass: (h) => {
    return [
      h,
      locals.hideHeaders[h] ? 'hidden' : '',
    ]
  },
  scopeClass: (scope) => {
    return [
      scope,
      locals.scope === scope ? 'selected' : '',
    ]
  },
  hideSources: {},
  hideCategories: {},
  headers: [
    'weapon',
    'damage',
    'projectile',
    'dps',
    'dps2',
  ],
  hideHeaders: {},
  weaponCols: new Set('damage'),
  id: (obj, prop='id') => {
    const v = obj[prop]
    if(!v) return

    return v.toString(16).toUpperCase()
  },
  allExplosion: () => {
    return data.explosions
  },
  hasTag,
  wikiLink: (wpn) => {
    const url = 'https://helldivers.wiki.gg/wiki'
    const path = wpn.fullname.split(/\s+/).join('_')
    return `${url}/${path}`
  },
  objects: (scope) => {
    let arr = sorted(locals[scope].slice())
    if(scope === 'weapons') {
      arr = arr.filter(wpn => {
        if(locals.hideSources[wpn.source]) {
          return false
        }
        if(locals.hideCategories[wpn.category]) {
          return false
        }
        return true
      })
      arr = arr.flatMap(wpn => {
        if(wpn.subobjects && !locals.collapseDamage) {
          return [wpn, ...wpn.subobjects]
        }
        return [wpn]
      })
    }
    if(scope === 'stratagems') {
      arr = arr.flatMap(strat => {
        if(strat.subobjects) {
          return [strat, ...strat.subobjects]
        }
        return [strat]
      })
    }
    return arr
  },
  subObj: obj => {
    return obj.damage
  },
  scope: 'weapons',
  scopes: [
    'weapons',
    'stratagems',
    'damages',
    'projectiles',
    'explosions',
    'beams',
    'arcs',
  ],
  roundStart: wpn => {
    if(wpn.roundstart == null) return wpn.rounds
    return wpn.roundstart
  },
}

locals.lang = locals.langs[0]

function register(objects, prop = 'id') {
  const reg = {}
  for(const obj of objects) {
    reg[obj[prop]] = obj
  }
  return reg
}

function round(v, decimals = 2) {
  v = +v || 0
  return +v.toFixed(decimals)
}

window.tmissing = {}
function t(namespace, key, fallback, l = locals.lang) {
  const fullKey = [namespace, key].join(';')
  const val = translations[l]?.[fullKey]
  if(val == null) {
    if(!tmissing[l]) tmissing[l] = {}
    tmissing[l][fullKey] = fallback || key
    if(l === 'en') {
      return fallback || key
    } else {
      return t(namespace, key, fallback, 'en')
    }
  } else {
    return val
  }
}
window.t = t

async function loadData() {
  const [
    manual,
    mined,
    translations,
  ] = await Promise.all([
    fetch(`data/weapons.json`).then(res => res.json()),
    fetch(`data/datamined.json`).then(res => res.json()),
    fetch(`data/lang-${locals.lang}.json`)
      .then(res => res.json())
      .catch(() => ({})),
  ])
  const data = {
    ...manual,
    ...mined,
  }
  window.data = data
  window.translations[locals.lang] = translations
  if(locals.lang !== 'en') {
    window.translations.en = await fetch(`data/lang-en.json`)
      .then(res => res.json())
      .catch(() => ({}))
  }
  locals.damages = data.damages.map((obj, idx) => {
    return {
      idx,
      ...obj,
      name: t('dmg', obj.enum),
    }
  })
  const damages = register(locals.damages)
  locals.projectiles = data.projectiles.map((obj, idx) => {
    return {
      idx,
      ...obj,
      name: t('prj', obj.enum),
      damage: damages[obj.damageid],
      gravity: round(obj.gravity),
      drag: round(obj.drag),
      penslow: round(obj.penslow),
    }
  })
  const projectiles = register(locals.projectiles)
  locals.explosions = data.explosions.map((obj, idx) => {
    return {
      idx,
      ...obj,
      name: t('aoe', obj.enum),
      damage: damages[obj.damageid],
      r1: round(obj.r1),
      r2: round(obj.r2),
      r3: round(obj.r3),
    }
  })
  const explosions = register(locals.explosions)
  locals.beams = data.beams.map((obj, idx) => {
    return {
      idx,
      ...obj,
      name: t('beam', obj.enum),
      damage: damages[obj.damageid],
    }
  })
  const beams = register(locals.beams)
  locals.arcs = data.arcs.map((obj, idx) => {
    return {
      idx,
      ...obj,
      name: t('arc', obj.enum),
      damage: damages[obj.damageid],
    }
  })
  const arcs = register(locals.arcs)
  const registers = {
    projectile: projectiles,
    explosion: explosions,
    damage: damages,
    beam: beams,
    arc: arcs,
  }
  locals.weapons = data.weapons.map((wpn, idx) => {
    const [, code, name] = /^(\w+-\d+\w*) (.*)$/.exec(wpn.fullname) || []
    const arc = arcs[wpn.arcid]
    const beam = beams[wpn.beamid]
    const projectile = projectiles[wpn.projectileid]
    const explosion = explosions[wpn.explosionid]
    const dmgId = projectile?.damageid
      || arc?.damageid
      || beam?.damageid
      || explosion?.damageid
      || wpn.damageid
    const damage = damages[dmgId]
    const count = wpn.count || projectile?.pellets || 1
    let shotdmg = count * (damage?.dmg || 0)
    let shotdmg2 = count * (damage?.dmg2 || 0)
    let subobjects = wpn.subattacks?.map(({ id, type, count, name }) => {
      const obj = registers[type][id]
      const damage = obj.damage
      const n = (count || obj.pellets || 1)
      shotdmg += n * (damage?.dmg || 0)
      shotdmg2 += n * (damage?.dmg2 || 0)
      name = obj.name
      return {
        type,
        damage,
        [type]: obj,
        count,
        name,
        fullname: wpn.fullname,
        weapon: wpn,
      }
    })
    if(wpn.chargefactor && wpn.chargeearly) {
      subobjects ||= []
      subobjects.push({
        ...wpn,
        name: t('wpnname.overcharge', wpn.fullname, `${name} (Overcharged)`),
        charge: wpn.charge,
        chargeearly: void 0,
        damage: {
          ...damage,
          dmg: charged(wpn, damage.dmg),
          dmg2: charged(wpn, damage.dmg2),
          ap1: charged(wpn, damage.ap1),
          ap2: charged(wpn, damage.ap2),
          ap3: charged(wpn, damage.ap3),
          ap4: charged(wpn, damage.ap4),
          stun: charged(wpn, damage.stun),
        },
      })
      wpn.charge = wpn.chargeearly
      delete wpn.chargeearly
    }

    let dps
    let dps2
    let tdps
    let tdps2
    let magdump
    let magdump2
    let totaldump
    let totaldump2
    let magtime
    if(hasTag(wpn, 'laser') && damage) {
      dps = damage.dmg
      dps2 = damage.dmg2
      magdump = dps * wpn.limit
      magdump2 = dps2 * wpn.limit
      magtime = wpn.limit
    }
    let rpm = wpn.rpm
    if(wpn.charge && wpn.cap > 1) {
      rpm = 60 / wpn.charge
    }
    if(wpn.cap > 1 && rpm) {
      dps = Math.floor(rpm * shotdmg / 60)
      dps2 = Math.floor(rpm * shotdmg2 / 60)
      magtime = wpn.cap * 60 / rpm
    }
    if(wpn.cap > 1 && shotdmg) {
      magdump = shotdmg * wpn.cap
      magdump2 = shotdmg2 * wpn.cap
    }
    if(wpn.limit && wpn.rpm) { // Sickle
      magdump = shotdmg * Math.floor(wpn.rpm * wpn.limit / 60)
      magdump2 = shotdmg2 * Math.floor(wpn.rpm * wpn.limit / 60)
    }
    if(magdump && wpn.mags) {
      totaldump = magdump * (wpn.mags + 1)
      totaldump2 = magdump2 * (wpn.mags + 1)
    }
    if(wpn.rounds) {
      totaldump = shotdmg * (wpn.rounds + (wpn.cap || 0))
      totaldump2 = shotdmg2 * (wpn.rounds + (wpn.cap || 0))
    }
    if(wpn.clips) {
      totaldump = shotdmg * (wpn.clips * wpn.clipsize + wpn.cap)
      totaldump2 = shotdmg2 * (wpn.clips * wpn.clipsize + wpn.cap)
    }
    if(magdump && magtime && wpn.reload) {
      tdps = Math.floor(magdump / (magtime + wpn.reload))
      tdps2 = Math.floor(magdump2 / (magtime + wpn.reload))
    }

    return {
      ...(projectile || {}),
      ...(damage || {}),
      idx,
      ...wpn,
      name: t('wpnname', wpn.fullname),
      sourceidx: (data.sources.indexOf(wpn.source) + 1) || Infinity,
      shotdmg,
      shotdmg2,
      dps,
      tdps,
      magdump,
      totaldump,
      dps2,
      tdps2,
      magdump2,
      totaldump2,
      code,
      projectile,
      arc,
      beam,
      explosion,
      damage,
      subobjects,
    }
  })

  const byRef = {
    weapon: register(locals.weapons, 'fullname'),
    damage: register(locals.damages, 'enum'),
    projectile: register(locals.projectiles, 'enum'),
    explosion: register(locals.explosions, 'enum'),
    beam: register(locals.beams, 'enum'),
    arc: register(locals.arcs, 'enum'),
  }
  window.byRef = byRef

  const arrowMap = {
    d: '🡇',
    u: '🡅',
    l: '🡄',
    r: '🡆',
  }
  const arrowOrder = {
    u: 1,
    r: 2,
    d: 3,
    l: 4,
  }
  const strats = [
    ...data.weapons.filter(wpn => wpn.stratcode),
    ...data.stratagems,
  ]
  locals.stratagems = strats.map((strat, i) => {
    let shotdmg = 0
    let shotdmg2 = 0
    let maxRadius = [0, 0, 0]
    let subobjects = strat.attack?.map(({ medium, ref, count }) => {
      const obj = byRef[medium][ref]
      const damage = obj.damage
      const n = (count || obj.pellets || 1)
      shotdmg += n * (damage?.dmg || 0)
      shotdmg2 += n * (damage?.dmg2 || 0)
      name = obj.name
      if(medium === 'explosion') {
        for(let i = 0; i < 3; i++) {
          maxRadius[i] = Math.max(maxRadius[i], obj[`r${i + 1}`])
        }
      }
      return {
        ...(medium === 'weapon' ? obj : {}),
        type: medium,
        damage,
        [medium]: obj,
        count,
        name,
        fullname: strat.fullname,
        stratagem: strat,
      }
    })
    const arrows = strat.stratcode.split('').map(i => arrowMap[i]).join('')
    const stratorder = strat.stratcode.split('').map(i => arrowOrder[i]).join('')

    if(strat.category === 'orbital' || strat.category === 'eagle') {
      const factor = (strat.cap || 1) * (strat.limit || 1)
      shotdmg *= factor
      shotdmg2 *= factor
    }

    let mainAttack
    if(subobjects?.[0] && subobjects[0].type !== 'weapon') {
      mainAttack = subobjects.shift()
    }
    return {
      ...(mainAttack || {}),
      ...strat,
      idx: i + 1,
      name: t('stratname', strat.fullname),
      calltime: strat.calltime || 0,
      shotdmg,
      shotdmg2,
      arrows,
      stratorder,
      subobjects,
      maxRadius1: maxRadius[0],
      maxRadius2: maxRadius[1],
      maxRadius3: maxRadius[2],
    }
  })

  locals.cats = Array.from(new Set(locals.weapons.map(wpn => wpn.category)))
  locals.sources = data.sources.slice(0, -1)
  readState()
  render()
}

function sortBy(col, objName) {
  return function sort() {
    locals.sorting = col
    locals.mainSorting = objName
    render()
  }
}

function addChevron(prop, mainProp) {
}

window.render = function render() {
  document.querySelector('body').innerHTML = template(locals)
  const headers = document.querySelectorAll('th:not(.th-groups, .label)')
  for(const h of headers) {
    const [mainProp, prop] = h.classList
    if(prop === locals.sorting) {
      h.classList.add('sorting')
    }
    h.addEventListener('click', sortBy(prop, mainProp))
    const chevron = document.createElement('span')
    chevron.classList.add('sorter')
    chevron.textContent = '▼'
    h.appendChild(chevron)
    if(mainProp === 'weapon' && prop === 'damage') {
    }
  }
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

  writeState()
  render()
}

function writeState() {
  const states = []
  for(const [h, hide] of Object.entries(locals.hideHeaders)) {
    if(!hide) continue
    states.push(`hh[]=${h}`)
  }
  for(const [c, hide] of Object.entries(locals.hideCategories)) {
    if(!hide) continue
    states.push(`hc[]=${c}`)
  }
  for(const [s, hide] of Object.entries(locals.hideSources)) {
    if(!hide) continue
    states.push(`hs[]=${s}`)
  }
  if(locals.scope !== 'weapons') {
    states.push(`scope=${locals.scope}`)
  }
  if(locals.lang !== 'en') {
    states.push(`lang=${locals.lang}`)
  }
  try {
    window.location.hash = '#' + states.sort().join('&')
  } catch(err) {
    console.warn(err)
  }
}

function readState() {
  let states
  try {
    let hash = window.location.hash
    if(!hash) {
      hash = '#hc[]=Ability&hc[]=Status&hc[]=Mounted&hh[]=dps&hh[]=dps2'
    }
    states = hash.slice(1).split('&').map(kv => kv.split('='))
  } catch(err) {
    console.warn(err)
    return
  }
  for(const [k, v] of states) {
    switch(k) {
      case 'hh[]': {
        locals.hideHeaders[v] = true
        break
      }
      case 'hc[]': {
        locals.hideCategories[v] = true
        break
      }
      case 'hs[]': {
        locals.hideSources[v] = true
        break
      }
      case 'scope': {
        locals.scope = v.toLowerCase()
        break
      }
      case 'lang': {
        locals.lang = v.toLowerCase()
        break
      }
    }
  }
  // Sanity check important values
  if(locals.scope !== 'weapons' && !locals.scopes.includes(locals.scope)) {
    locals.scope = 'weapons'
  }
}


window.switchLang = function switchLang(lang) {
  locals.lang = lang
  writeState()
  loadData()
}

window.toggleSource = function toggleSource(source) {
  toggleAction({
    item: source,
    items: locals.sources,
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

window.toggleHeader = function toggleHeader(h) {
  toggleAction({
    item: h,
    items: locals.headers,
    register: locals.hideHeaders,
  })
}

window.toggleCollapseDamage = function toggleNerdMode(ev) {
  ev.preventDefault()
  ev.stopPropagation()
  locals.collapseDamage = !locals.collapseDamage
  writeState()
  render()
}

window.switchScope = function switchScope(scope) {
  locals.scope = scope
  writeState()
  render()
}

readState()
loadData()
