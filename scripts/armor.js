import fs from 'fs'

const rows = fs.readFileSync('./data/damage-tests.csv', 'utf-8')
  .split('\n')
  .slice(1)
  .map(r => r.split(','))

const hp = 125
for(const [damage, limb, armor, remaining] of rows) {
  const dmg = hp - remaining
  const reduction = +(100 * (1 - (dmg / damage))).toFixed(2)
  console.log(`${limb}(${armor}): ${damage} -> ${dmg} (${reduction}%)`)
}
