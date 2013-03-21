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
  SIZE[0] = num.charCodeAt(0)
  SIZE[1] = num.charCodeAt(1)
  SIZE[2] = num.charCodeAt(2)
  SIZE[3] = num.charCodeAt(3)
  return SIZE
}

function line(buf) {
  // send flush-pkt if !buf
  if(!buf) {
    SIZE[0] =
    SIZE[1] =
    SIZE[2] =
    SIZE[3] = 48 
    return SIZE
  }

  if(!Buffer.isBuffer(buf)) {
    buf = new Buffer(buf, 'utf8')
  }
  buf = Buffer.concat([fourbyte(4 + buf.length), buf], 4 + buf.length)
  return buf
}
