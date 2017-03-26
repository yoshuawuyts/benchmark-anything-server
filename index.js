var hypercore = require('hypercore')
var Env = require('./lib/env')
var merry = require('./lib')

var env = Env({
  PORT: 8080,
  DB_LOCATION: '/tmp/benchmark-anything-server.db'
})

var core = hypercore(env.DB_LOCATION, {
  valueEncoding: 'json'
})

var app = merry()
app.route('GET', '/', index)
app.route('POST', '/submit', submit)
app.route('GET', '/404', notFound)
app.listen(env.PORT)

function index (req, res, ctx) {
  res.statusCode = 200
  res.end('hi')
}

function submit (req, res, ctx) {
  res.statusCode = 200
  res.end('hi')
}

function notFound (req, res, ctx) {
  res.statusCode = 404
  res.end()
}
