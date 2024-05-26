function val(obj, prop) {
  return obj[prop] || 0
}

function sorting(col) {
  let dir = -1
  if(['id', 'damageid', 'name'].includes(col)) {
    dir = 1
  }

  function idSort(a, b) {
    return a.id - b.id
  }

  if(col === 'name') {
    return function sortByName(a, b) {
      const diff = (a.name || '').localeCompare(b.name || '') * dir
      return diff || idSort(a, b)
    }
  }

  function compare(a, b, prop) {
    return (val(a, prop) - val(b, prop)) * dir
  }

  if(col === 'dmg') {
    return function dmgSort(a, b) {
      return compare(a, b, 'dmg') || compare(a, b, 'mass') || idSort(a, b)
    }
  }
  if(col === 'ap') {
    return function apSort(a, b) {
      for(let i = 1; i <= 4; i++) {
        const diff = compare(a, b, `ap${i}`)
        if(diff) return diff
      }
      return idSort(a, b)
    }
  }
  if(col === 'radius') {
    return function radiusSort(a, b) {
      for(let i = 1; i <= 3; i++) {
        const diff = compare(a, b, `r${i}`)
        if(diff) return diff
      }
      return idSort(a, b)
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
      return idSort(a, b)
    }
  }
  return function defaultSort(a, b) {
    return compare(a, b, col) || idSort(a, b)
  }
}

window.locals = {
  sorting: 'id',
  id: (obj, prop='id') => {
    const v = obj[prop]
    if(!v) return

    return v.toString(16).toUpperCase()
  },
  sorted: (arr) => {
    return arr.sort(sorting(locals.sorting))
  },
  allExplosion: () => {
    return data.explosions
  },
  nerdScope: 'projectiles',
  nerdScopes: [
    'damages',
    'projectiles',
    'explosions',
  ],
}

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

const suffixes = {
  ap: 'Armor Piercing',
  buc: 'Buckshot',
  bug: 'Bugbite',
  fle: 'Flechette',
  fmj: 'Full Metal Jacket',
  smj: 'Soft Metal Jacket',
  bir: 'Birdshot',
  dev: 'Development',
  hp: 'Hollow-Point ',
  rip: 'R.I.P.',
  exp: 'Explosive',
  ss: 'Subsonic',
  hv: 'High-Velocity',
  ther: 'Thermite',
  mag: 'Magnum',
  sab: 'Sabot',
  sab2: 'Sabot Duplex',
  sabhv: 'High-Velocity Sabot',
  snb: 'Sniper Round (HVAP)',
  spr: 'Self-Propelled Rocket',
  slug: 'Slug',
  emp: 'EMP',
  std: 'Standard',
  frag: 'Frag',
  airb: 'Airburst',
  tox: 'Toxic',
  pla: 'Plasma',
  stun: 'Stun',
  tracer: 'Tracer',
  turret: 'Turret',
  silent: 'Silent',
  tri: 'Tri-Ball',
  magtri: 'Tri-Ball Magnum',
  flm: 'Flechette Magnesium',
  Hmg: 'Heavy Machine Gun',
  Mg: 'Machine Gun',
  Aa: 'Anti-Air',
  '10g': '10-Gauge',
  '12g': '12-Gauge',
  Staticfield: 'Static Field',
}

const nPointNRex = /^(\d+)p(\d+)x(\d+)mm$/
function translate(scope, p) {
  const suffix = suffixes[p]
  if(suffix) return suffix
  const pointNum = nPointNRex.exec(p)
  if(pointNum) {
    const [, cm, mm, length] = pointNum
    return `${cm}.${mm}x${length}mm`
  }
  return p
}

function enumName(scope, obj) {
  const parts = obj.enum
    .match(/[0-9A-Z]+[a-z0-9]*|[a-zA-Z0-9]+/g)
    .map(p => translate(scope, p))
  return parts.join(' ')
}

async function loadData() {
  const [
    manual,
    mined,
  ] = await Promise.all([
    fetch(`data/manual.json`).then(res => res.json()),
    fetch(`data/datamined.json`).then(res => res.json()),
  ])
  const data = {
    ...manual,
    ...mined,
  }
  window.data = data
  locals.damages = data.damages.map(obj => {
    return {
      ...obj,
      name: enumName('damages', obj),
    }
  })
  const damages = register(locals.damages)
  locals.projectiles = data.projectiles.map(obj => {
    return {
      ...obj,
      name: enumName('projectiles', obj),
      damage: damages[obj.damageid],
      gravity: round(obj.gravity),
      drag: round(obj.drag),
      penslow: round(obj.penslow),
    }
  })
  locals.explosions = data.explosions.map(obj => {
    return {
      id: obj.id,
      ...obj,
      name: enumName('explosions', obj),
      damage: damages[obj.damageid],
      r1: round(obj.r1),
      r2: round(obj.r2),
      r3: round(obj.r3),
    }
  })
}

function sortBy(col) {
  return function sort() {
    locals.sorting = col
    render()
  }
}

function render() {
  document.querySelector('body').innerHTML = template(locals)
  const headers = document.querySelectorAll('th')
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

window.switchScope = function switchScope(scope) {
  locals.nerdScope = scope
  locals.sorting = 'id'
  render()
}

loadData().then(() => render())
