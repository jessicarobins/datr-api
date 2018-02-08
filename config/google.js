const Promise = require('bluebird')
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_PLACES_API_KEY,
  Promise
})

module.exports = maps
