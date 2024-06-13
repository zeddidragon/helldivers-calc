import fs from 'fs'

const csv = fs.readFileSync('data/reloads.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map(r => r.split(','))

function toFrames(stamp) {
  const [frame, sec = 0, min = 0] = stamp.split(':').reverse().map(v => +v)
  return frame + sec * 60 + min * 60 * 60
}

for(let row of csv) {
  const [name, ...pairs] = row
  console.log(`# ${name}`)
  for(let i = 0; i < pairs.length; i += 2) {
    const frames = toFrames(pairs[i + 1]) - toFrames(pairs[i])
    const seconds = (frames / 60).toFixed(1)
    console.log(`- ${seconds} sec`)
  }
}
