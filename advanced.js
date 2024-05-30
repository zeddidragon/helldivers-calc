function val(obj, prop) {
  return obj[prop] || 0
}

function sorting(col) {
  let dir = -1
  if(col === 'category') {
    col = 'idx'
  }
  if(['idx', 'id', 'damageid', 'code', 'name', 'source'].includes(col)) {
    dir = 1
  }

  function idxSort(a, b) {
    return a.id - b.id
  }

  if(col === 'name' || col === 'code') {
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
      return compare(a, b, 'totaldmg') || compare(a, b, 'totaldmg2') || idxSort(a, b)
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

window.translations = {}

function sorted(arr) {
  return arr.sort(sorting(locals.sorting))
}

window.locals = {
  sorting: 'idx',
  lang: 'en',
  langs: [
    'en',
    'ru',
  ],
  colspans: {
    damages: 5,
    weapons: 11,
    explosions: 3,
    projectiles: 6,
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
  hideSources: {},
  hideCategories: {},
  weaponCols: new Set('damage'),
  id: (obj, prop='id') => {
    const v = obj[prop]
    if(!v) return

    return v.toString(16).toUpperCase()
  },
  allExplosion: () => {
    return data.explosions
  },
  hasTag: (wpn, tag) => {
    return wpn.tags?.includes(tag)
  },
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
        if(wpn.subobjects) {
          return [wpn, ...wpn.subobjects]
        }
        return [wpn]
      })
    }
    return arr
  },
  scope: 'weapons',
  nerdScopes: [
    'damages',
    'projectiles',
    'explosions',
  ],
  roundStart: wpn => {
    if(wpn.roundstart == null) return wpn.rounds
    return wpn.roundstart
  },
}

locals.lang = locals.langs[0]

function register(objects) {
  const reg = {}
  for(const obj of objects) {
    reg[obj.id] = obj
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
    fetch(`data/advanced.json`).then(res => res.json()),
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
  const registers = {
    projectile: projectiles,
    explosion: explosions,
  }
  locals.weapons = data.weapons.map((wpn, idx) => {
    const [, code, name] = /^(\w+-\d+\w*) (.*)$/.exec(wpn.fullname) || []
    const projectile = projectiles[wpn.projectileid]
    const explosion = explosions[wpn.explosionid]
    const dmgId = projectile?.damageid
      || explosion?.damageid
      || wpn.damageid
    const damage = damages[dmgId]
    const count = wpn.count || projectile?.pellets || 1
    let totaldmg = count * (damage?.dmg || 0)
    let totaldmg2 = count * (damage?.mass || 0)
    const subobjects = wpn.subattacks?.map(({ id, type, count, name }) => {
      const obj = registers[type][id]
      const damage = damages[obj.damageid]
      const n = (count || obj.pellets || 1)
      totaldmg += n * (damage?.dmg || 0)
      totaldmg2 += n * (damage?.dmg2 || 0)
      name = obj.name
      return {
        type,
        [type]: obj,
        count,
        name,
        fullname: wpn.fullname,
        damage,
        weapon: wpn,
      }
    })
    return {
      ...(projectile || {}),
      ...(damage || {}),
      idx,
      ...wpn,
      name: t('wpnname', wpn.fullname, name),
      sourceidx: (data.sources.indexOf(wpn.source) + 1) || Infinity,
      totaldmg,
      totaldmg2,
      code,
      projectile,
      explosion,
      damage,
      subobjects,
    }
  })
  locals.cats = Array.from(new Set(locals.weapons.map(wpn => wpn.category)))
  locals.sources = data.sources.slice(0, -1)
  render()
}

function sortBy(col) {
  return function sort() {
    locals.sorting = col
    render()
  }
}

window.render = function render() {
  document.querySelector('body').innerHTML = template(locals)
  const headers = document.querySelectorAll('th:not(.th-groups, .label)')
  for(const h of headers) {
    const prop = h.classList[1]
    if(prop === locals.sorting) {
      h.classList.add('sorting')
    }
    h.addEventListener('click', sortBy(prop))
    const chevron = document.createElement('span')
    chevron.classList.add('sorter')
    chevron.textContent = '▼'
    h.appendChild(chevron)
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
  render()
}

window.switchScope = function switchScope(scope) {
  locals.scope = scope
  locals.sorting = 'idx'
  render()
}

window.switchLang = function switchLang(lang) {
  const langSel = document.getElementById('lang-select')
  locals.lang = langSel.value
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

loadData()
