// ♥️  you Shalzuth, thanks for all your help
// 
//
// Paste this in your console browser here: https://helldivers.io/Enemies
var rows = document.querySelectorAll("tbody tr")
var data = []
for(var r of rows) {
  const row = []
  for(var td of r.querySelectorAll('td')) {
    row.push(td.textContent)
  }
  data.push(row)
}

function collapse(block) {
  return block.trim().split(/\W+/mg)
}

const tests = Object.entries({
  name: str => /\W*(.*) : /i.exec(str)?.[1]?.toLowerCase(),
  health: str => +/(\d+) health/i.exec(str)?.[1],
  armor: str => +/(\d+) armor/i.exec(str)?.[1],
  durable: str => +/(\d+)% durable/i.exec(str)?.[1],
  bleedthrough: str => +/(\d+)% to main/i.exec(str)?.[1],
  bleedout: str => +/bleedsout (\d+)%/i.exec(str)?.[1],
  fatal: str => /fatal/i.test(str),
  explosion_immune: str => /explosionimmunity/i.test(str),
})

function ripTableData(rows) {
  const enemies =  {}
  for(const row of rows) {
    const  [, name, health] = /\W+(.*)\W+(\d+) Total Health/.exec(row[0])
    const parts = { main: { health } }
    enemies[name] = parts
    for(const partstr of row[1].trim().split('\n')) {
      const part = {}
      for(const [key, test] of tests) {
        const val = test(partstr)
        if(val) {
          part[key] = val
        }
      }
      parts[part.name] = { ...part, name: void 0 }
    }
  }
  return JSON.stringify(enemies, null, 2)
}

copy(ripTableData(data))
