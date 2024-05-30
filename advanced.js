function val(obj, prop) {
  return obj[prop] || 0
}

function sorting(col) {
  let dir = -1
  if(['idx', 'id', 'damageid', 'name'].includes(col)) {
    dir = 1
  }

  function idxSort(a, b) {
    return a.id - b.id
  }

  if(col === 'name') {
    return function sortByName(a, b) {
      const diff = (a.name || '').localeCompare(b.name || '') * dir
      if(diff) return diff
      const enumDiff = (a.enum || '').localeCompare(b.enum || '') * dir
      if(enumDiff) return enumDiff
      return idxSort(a, b)
    }
  }

  function compare(a, b, prop) {
    return (val(a, prop) - val(b, prop)) * dir
  }

  if(col === 'dmg') {
    return function dmgSort(a, b) {
      return compare(a, b, 'dmg') || compare(a, b, 'mass') || idxSort(a, b)
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
    damages: 18,
    weapons: 11,
    explosions: 3,
    projectiles: 7,
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
    let arr = locals[scope].slice()
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
    const subobjects = wpn.subattacks?.map(({ id, type, count, name }) => {
      const obj = registers[type][id]
      if(name === true) {
        name = obj.name
      }
      return {
        type,
        [type]: obj,
        count,
        name,
        fullname: wpn.fullname,
        damage: damages[obj.damageid],
        weapon: wpn,
      }
    })
    return {
      idx,
      ...wpn,
      name: t('wpnname', wpn.fullname, name),
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
