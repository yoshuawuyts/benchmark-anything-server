var wayfarer = require('wayfarer')
var assert = require('assert')
var http = require('http')
var pino = require('pino')

module.exports = Merry

function Merry (opts) {
  if (!(this instanceof Merry)) return new Merry(opts)
  this._router = wayfarer('/404')
  this._log = pino({ name: 'merry' })
}

Merry.prototype.route = function (method, name, handler) {
  var self = this

  assert.equal(typeof method, 'string', 'merry.route: method should be type string')
  assert.equal(typeof name, 'string', 'merry.route: name should be type string')
  assert.equal(typeof handler, 'function', 'merry.route: handler should be type function')

  method = method.toUpperCase()

  this._router.on(method + ' ' + name, function (params, req, res) {
    var startBytes = req.socket.bytesWritten
    var startTime = Date.now()
    var ctx = { params: params }

    handler(req, res, ctx)
    res.once('finish', function () {
      self._log.info({
        url: req.url,
        method: req.method,
        statusCode: res.statusCode,
        message: 'response',
        elapsed: Date.now() - startTime,
        contentLength: req.socket.bytesWritten - startBytes
      })
    })
  })
}

Merry.prototype.listen = function (port) {
  var self = this
  assert.equal(typeof port, 'number', 'merry.listen: port should be type number')

  var server = http.createServer(function (req, res) {
    self._router(req.method + ' ' + req.url, req, res)
  })

  server.listen(port, function () {
    self._log.info({
      message: 'listening',
      port: this.address().port,
      env: process.env.NODE_ENV || 'undefined'
    })
  })
}
