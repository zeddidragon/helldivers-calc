import clipboard from 'clipboardy'
// 5.5 (calibre), 900 (speed), 4.5 (mass), 0.3 (drag) 

let bytes = Buffer.alloc(4 * 4)
bytes.writeFloatLE(900, 0x0) // Velocity
bytes.writeFloatLE(4.5, 0x4) // Mass
bytes.writeFloatLE(0.3, 0x8) // Drag
bytes.writeFloatLE(1.0, 0xc) // Gravity

const str = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join(' ')
console.log(str)
clipboard.writeSync(str)
