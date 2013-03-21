module.exports = writeline

var through = require('through')
  , Buffer = require('buffer').Buffer
  , SIZE = new Buffer(4)

function writeline() {
  var stream = through(write, end)

  return stream

  function write(buf) {
    this.queue(line(buf.length ? buf+'\n' : ''))    
  }

  function end() {
    this.queue(null)
  }
}

function fourbyte(num) {
  num = num.toString(16)
  while(num.length < 4) {
    num = '0'+num
  }
  SIZE.writeUInt8(num.charCodeAt(0), 0)
  SIZE.writeUInt8(num.charCodeAt(1), 1)
  SIZE.writeUInt8(num.charCodeAt(2), 2)
  SIZE.writeUInt8(num.charCodeAt(3), 3)
  return SIZE
}

function line(buf) {
  // send flush-pkt if !buf
  if(!buf) {
    SIZE.writeUInt32BE(0x30303030, 0)
    return SIZE
  }

  if(!Buffer.isBuffer(buf)) {
    buf = new Buffer(buf, 'utf8')
  }
  buf = Buffer.concat([fourbyte(4 + buf.length), buf], 4 + buf.length)
  return buf
}
