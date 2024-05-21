import clipboard from 'clipboardy'
// 5.5 (calibre), 900 (speed), 4.5 (mass), 0.3 (drag) 

let bytes = Buffer.alloc(4 * 4)
bytes.writeFloatLE(90, 0x0) // Velocity
bytes.writeFloatLE(100, 0x4) // Mass
bytes.writeFloatLE(4, 0x8) // Drag
bytes.writeFloatLE(3.0, 0xc) // Gravity

const str = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
console.log(str)
clipboard.writeSync(str)
