var test = require('tape')
  , send = require('./index')
  , Buffer = require('buffer').Buffer

test('works as expected', function(assert) {
  var stream = send()
    , expect = ['0007hi\n', '0032want 0000000000000000000000000000000000000000\n', '0000', '0007hi\n']
    , data = ['hi', 'want 0000000000000000000000000000000000000000', '', new Buffer('hi', 'utf8')]
    , idx = 0


  stream.on('data', function(d) {
    assert.ok(Buffer.isBuffer(d))
    assert.equal(d+'', expect[idx]) 
  })

  do {
    stream.write(data[idx])
  } while(++idx !== expect.length)
  assert.end()
})
