import fs from 'fs'

const data = JSON.parse(fs.readFileSync('data/datamined.json'))
const idRegister = {}
const refRegister = {}

const blacklist = [
  'statuses',
  'statusNames',
  'version',
]
for(const [k, objs] of Object.entries(data)) {
  if(blacklist.includes(k)) {
    continue
  }
  let sliced = k.slice(0, -1)
  const subIdRegister = {}
  const subRefRegister = {}
  idRegister[sliced] = subIdRegister
  refRegister[sliced] = subRefRegister
  
  for(const obj of objs) {
    subIdRegister[obj.id] = obj
    const obj2 = { ...obj }
    if(obj.damageid) {
      const damage = idRegister.damage[obj.damageid]
      obj2.damageref = damage.enum
    }
    subRefRegister[obj.enum] = obj2
  }
}
idRegister.status = data.statusNames
refRegister.status = data.statusNames

export function getIdRegister() {
  return idRegister
}

export function getRefRegister() {
  return refRegister
}
