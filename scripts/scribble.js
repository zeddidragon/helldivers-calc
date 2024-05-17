import clipboard from 'clipboardy'
// 5.5 (calibre), 900 (speed), 4.5 (mass), 0.3 (drag) 

let bytes = Buffer.alloc(4 * 3)
bytes.writeFloatLE(900, 0)
bytes.writeFloatLE(4.5, 4)
bytes.writeFloatLE(0.3, 8)

const str = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
console.log(str)
clipboard.writeSync(str)
