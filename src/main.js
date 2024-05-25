window.locals = {
  id: (obj, prop='id') => {
    const v = obj[prop]
    if(!v) return
    return v.toString(16).toUpperCase()
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
  hv: 'High Velocity',
  ther: 'Thermite',
  mag: 'Magnum',
  sab: 'Sabot',
  sab2: 'Sabot 2',
  airb: 'Airburst',
  tox: 'Toxic',
  pla: 'Plasma',
  stun: 'Stun',
  tracer: 'Tracer',
  turret: 'Turret',
  silent: 'Silent',
  flm: 'Flechette Magnesium',
  Hmg: 'Heavy Machine Gun',
  Mg: 'Machine Gun',
  Aa: 'Anti-Air',
  '10g': '10-Gauge',
  '12g': '12-Gauge',
  Staticfield: 'Static Field',
}

function enumName(scope, obj) {
  const parts = obj.enum
    .match(/[0-9A-Z]+[a-z0-9]*|[a-zA-Z0-9]+/g)
    .map(p =>  suffixes[p] || p)
  return parts.join(' ')
}

async function loadData() {
  window.data = (await fetch(`data/datamined.json`).then(res => res.json()))
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

function render() {
  document.querySelector('body').innerHTML = template(locals)
}

window.switchScope = function switchScope(scope) {
  locals.nerdScope = scope
  render()
}

loadData().then(() => render())
