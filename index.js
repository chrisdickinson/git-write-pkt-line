module.exports = writeline

var through = require('through')
  , binary = require('bops')
  , SIZE = binary.create(4)

function writeline() {
  var stream = through(write, end)

  return stream

  function write(buf) {
    buf = typeof buf === 'string' ? buf : binary.to(buf, 'utf8')

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
    binary.writeUInt32BE(SIZE, 0x30303030, 0)
    return SIZE
  }

  if(typeof buf === 'string') {
    buf = binary.from(buf, 'utf8')
  }
  buf = binary.join([fourbyte(4 + buf.length), buf])
  return buf
}
