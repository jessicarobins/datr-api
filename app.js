const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const index = require('./routes/index')
const places = require('./routes/places')
const geo = require('./routes/geo')

const app = express()

const whitelist = [
  /d35ubwyjjktcem.cloudfront.net/,
  /ineedadate.in/
]

const corsOptions = {
  origin: whitelist,
  credentials: true
}

app.use(cors(corsOptions))

app.set('port', process.env.PORT || 3001)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/', index)
app.use('/api/places', places)
app.use('/api/geo', geo)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`)
})

module.exports = app
