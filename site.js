function val(obj, prop) {
  return obj?.[prop] || 0
}

function iff(condition, value) {
  if(condition == null) {
    return null
  }
  return value
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

  const isWeapons = ['weapons', 'expanded'].includes(locals.scope)
  if(isWeapons && mainScope === 'projectile' && col === 'name') {
    return function sortByProjectileName(a, b) {
      const diff = (a.projectile?.[col] || '').localeCompare(b.projectile?.[col] || '') * dir
      if(diff) return diff
      return idxSort(a, b)
    }
  }
  if(isWeapons && mainScope === 'projectile') {
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
  search: '',
  get subScope() {
    switch(locals.scope) {
      case 'projectiles':
      case 'explosions':
      case 'beams':
      case 'arcs':
        return 'damages'
    }
  },
  get collapseDamage() {
    return locals.scope === 'weapons'
  },
  get isWeaponScope() {
    return ['weapons', 'expanded'].includes(locals.scope)
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
    explosions: 4,
    projectiles: 10,
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
    'dps',
    'dps2',
    'projectile',
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
    if(scope === 'expanded') {
      scope = 'weapons'
    }
    let arr = sorted(locals[scope].slice())
    const search = locals.search
    const fuseOptions = {
      // isCaseSensitive: false,
      // includeScore: false,
      shouldSort: false,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: [
        'fullname',
        'name',
        'category',
      ]
    }

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
      if(search) {
        const fuse = new Fuse(arr, fuseOptions);
        arr = fuse.search(search).map(({ item }) => item)
      }
      arr = arr.flatMap(wpn => {
        if(wpn.subobjects && !locals.collapseDamage) {
          return [wpn, ...wpn.subobjects]
        }
        return [wpn]
      })
    } else if(search) {
      const fuse = new Fuse(arr, fuseOptions);
      arr = fuse.search(search).map(({ item }) => item)
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
    'expanded',
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
  element: (wpn, idx) => {
    return data.elements[wpn.type]
  },
  effect: (wpn, idx) => {
    const id = wpn[`func${idx}`]
    const name = data.statuses[id]
    const param = wpn[`param${idx}`]
    return { id, name, param }
  },
  getHeader(scope, isSubScope) {
    if(!scope) {
      return
    }
    if(scope === 'expanded') {
      scope = 'weapons'
    }
    return `${scope}Header`
  },
  getRow(scope, isSubScope) {
    if(!scope) {
      return
    }
    if(scope === 'expanded') {
      scope = 'weapons'
    }
    return `${scope}Row`
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
  const byRef = {
    damage: register(locals.damages, 'enum'),
    projectile: register(locals.projectiles, 'enum'),
    explosion: register(locals.explosions, 'enum'),
    beam: register(locals.beams, 'enum'),
    arc: register(locals.arcs, 'enum'),
  }
  locals.weapons = data.weapons.map((wpn, idx) => {
    const [, code, name] = /^(\w+-\d+\w*) (.*)$/.exec(wpn.fullname) || []
    let shotdmg = 0
    let shotdmg2 = 0
    let shotdmgx = 0
    let prev = wpn
    let subobjects = wpn.attack?.map(({ type, name: ref, count }) => {
      const obj = byRef[type][ref]
      const parent = prev
      prev = obj
      const damage = obj.damage
      const n = (count || 1) * (obj.pellets || 1)
      if(type === 'explosion') {
        shotdmgx += n * (damage?.dmg || 0)
      } else {
        shotdmg += n * (damage?.dmg || 0)
        shotdmg2 += n * (damage?.dmg2 || 0)
      }
      return {
        parent,
        type,
        damage,
        [type]: obj,
        count: count,
        name: obj.name,
        fullname: wpn.fullname,
        weapon: wpn,
      }
    })

    const {
      damage,
      projectile,
      explosion,
      beam,
      arc,
      count,
    } = subobjects?.shift() || {}
    if(wpn.supply && !wpn.box) {
      wpn.box = Math.max(Math.floor(wpn.supply * 0.5), 1)
    }
    if(wpn.roundsupply && !wpn.roundsbox) {
      wpn.roundsbox = Math.max(Math.floor(wpn.roundsupply * 0.5), 1)
    }
    if(wpn.clipsupply && !wpn.clipsbox) {
      wpn.clipsbox = Math.max(Math.floor(wpn.clipsupply * 0.5), 1)
    }

    if(wpn.chargefactor && wpn.chargeearly) {
      subobjects ||= []
      subobjects.push({
        ...wpn,
        parent: wpn,
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
    let dpsx = 0
    let tdps
    let tdps2
    let tdpsx = 0
    let magdump
    let magdump2
    let magdumpx = 0
    let totaldump
    let totaldump2
    let totaldumpx = 0
    let magtime
    if(beam && damage) {
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
    if(wpn.cap !== 1 && rpm) {
      dps = Math.floor(rpm * shotdmg / 60)
      dps2 = Math.floor(rpm * shotdmg2 / 60)
      dpsx = Math.floor(rpm * shotdmgx / 60)
      magtime = wpn.cap * 60 / rpm
    }
    if(shotdmg) {
      const cap = wpn.cap || 1
      magdump = shotdmg * cap
      magdump2 = shotdmg2 * cap
      magdumpx = shotdmgx * cap
    }
    if(wpn.limit && wpn.rpm) { // Sickle
      magdump = shotdmg * Math.floor(rpm * wpn.limit / 60)
      magdump2 = shotdmg2 * Math.floor(rpm * wpn.limit / 60)
      magdumpx = shotdmgx * Math.floor(rpm * wpn.limit / 60)
    }
    if(magdump && wpn.mags) {
      totaldump = magdump * (wpn.mags + 1)
      totaldump2 = magdump2 * (wpn.mags + 1)
      totaldumpx = magdumpx * (wpn.mags + 1)
    }
    if(wpn.rounds) {
      const rounds = (wpn.rounds || 0) + (wpn.cap || 0)
      totaldump = shotdmg * rounds
      totaldump2 = shotdmg2 * rounds
      totaldumpx = shotdmgx * rounds
    }
    if(wpn.clips) {
      totaldump = shotdmg * (wpn.clips * wpn.clipsize + wpn.cap)
      totaldump2 = shotdmg2 * (wpn.clips * wpn.clipsize + wpn.cap)
      totaldumpx = shotdmgx * (wpn.clips * wpn.clipsize + wpn.cap)
    }
    if(magdump && magtime && wpn.reload) {
      tdps = Math.floor(magdump / (magtime + wpn.reload))
      tdps2 = Math.floor(magdump2 / (magtime + wpn.reload))
      tdpsx = Math.floor(magdumpx / (magtime + wpn.reload))
    }
    if(!shotdmg && damage) {
      shotdmg = damage.dmg
      shotdmg2 = damage.dmg2
      shotdmgx = damage.dmgx
    }
    if(wpn.category === 'Status' && damage) {
      dps = shotdmg
      dps2 = shotdmg2
      dpsx = shotdmgx || 0
    }

    return {
      ...(projectile || {}),
      ...(damage || {}),
      idx,
      ...wpn,
      name: t('wpnname', wpn.fullname),
      sourceidx: (data.sources.indexOf(wpn.source) + 1) || Infinity,
      shotdmg,
      dps: iff(dps, (dps + dpsx)),
      tdps: iff(tdps, (tdps + tdpsx)),
      magdump: iff(magdump, (magdump + magdumpx)),
      totaldump: iff(totaldump, (totaldump + totaldumpx)),
      shotdmg2,
      dps2: iff(dps2, (dps2 + dpsx)),
      tdps2: iff(tdps2, (tdps2 + tdpsx)),
      magdump2: iff(magdump2, (magdump2 + magdumpx)),
      totaldump2: iff(totaldump2, (totaldump2 + totaldumpx)),
      shotdmgx,
      dpsx,
      tdpsx,
      magdumpx,
      totaldumpx,
      code,
      count,
      projectile,
      arc,
      beam,
      explosion,
      damage,
      subobjects,
    }
  })
  byRef.weapon = register(locals.weapons, 'fullname')
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
    let prev = void 0
    let subobjects = strat.attack?.map(({ type, name: ref, count }) => {
      const obj = byRef[type][ref]
      const parent = prev
      prev = obj
      const damage = obj.damage
      const n = (count || obj.pellets || 1)
      shotdmg += n * (damage?.dmg || 0)
      shotdmg2 += n * (damage?.dmg2 || 0)
      name = obj.name
      if(type === 'explosion') {
        for(let i = 0; i < 3; i++) {
          maxRadius[i] = Math.max(maxRadius[i], obj[`r${i + 1}`])
        }
      }
      return {
        ...(type === 'weapon' ? obj : {}),
        parent,
        type,
        damage,
        [type]: obj,
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
  locals.sources = data.sources
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

function renderTable() {
  const tbody = document.getElementById('table-body')
  tbody.innerHTML = template({ ...locals, tbody: true })
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

const defaultSettings = {
  hh: [
    'projectile',
    'dps',
    'dps2',
  ],
  hc: [
    'Ability',
    'Status',
    'Mounted',
  ],
  hs: [],
  scope: 'weapons',
  lang: 'en',
}

function writeSubState(prop, obj, states) {
  for(const [h, hide] of Object.entries(obj)) {
    if(!hide) continue
    if(defaultSettings[prop].includes(h)) continue
    states.push(`${prop}[]=${h}`)
  }
  for(const [h, hide] of Object.entries(obj)) {
    if(hide) continue
    if(!defaultSettings[prop].includes(h)) continue
    states.push(`!${prop}[]=${h}`)
  }
}

function writePropState(prop, states) {
  const v = locals[prop]
  if(v !== defaultSettings[prop]) {
    states.push(`${prop}=${v}`)
  }
}

function writeState() {
  const hashStates = []
  const localStorageStates = []
  writePropState('scope', hashStates)
  writePropState('lang', hashStates)
  writeSubState('hh', locals.hideHeaders, localStorageStates)
  writeSubState('hs', locals.hideSources, localStorageStates)
  writeSubState('hc', locals.hideCategories, localStorageStates)
  // localStorage.hdSiteStates = localStorageStates.join('\n')
  try {
    window.location.hash = hashStates.join('&')
  } catch(err) {
    console.warn(err)
  }
}

function readPropState(prop, obj) {
  console.log({ prop, obj })
  return obj[prop] == null ? defaultSettings[prop] : obj[prop]
}

function readSubState(prop, obj) {
  const cfg = {}
  for(const unset of (defaultSettings[prop] || [])) {
    cfg[unset] = true
  }
  for(const unset of (obj[`!${prop}[]`] || [])) {
    cfg[unset] = true
  }
  for(const set of (obj[`${prop}[]`] || [])) {
    cfg[set] = false
  }
  console.log({ prop, cfg })
  return cfg
}

function readState() {
  let hashStates
  try {
    let hash = window.location.hash
    hashStates = hash.slice(1).split('&').map(kv => kv.split('='))
  } catch(err) {
    console.warn(err)
    return
  }
  const set = {}
  const localStorageStates = (localStorage.hdSiteStates || '')
    .split('\n')
    .map(kv => kv.split('='))
  for(const [k, v] of (hashStates || [])) {
    set[k] = v
  }
  for(const [k, v] of (localStorageStates || [])) {
    if(!set[k]) {
      set[k] = []
    }
    set[k].push(v)
  }
  locals.scope = readPropState('scope', set)
  locals.lang = readPropState('lang', set)
  locals.hideHeaders = readSubState('hh', set, locals.hideHeaders)
  locals.hideSources = readSubState('hs', set, locals.hideSources)
  locals.hideCategories = readSubState('hc', set, locals.hideCategories)
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

window.switchScope = function switchScope(scope) {
  locals.scope = scope
  locals.search = ''
  writeState()
  render()
}

window.resetState = function resetState(scope) {
  localStorage.hdSiteStates = ''
  readState()
  render()
}

window.search = function search() {
  const box = document.getElementById('text-search')
  locals.search = box.value
  renderTable()
}


readState()
loadData()
