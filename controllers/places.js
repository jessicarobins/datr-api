const Promise = require('bluebird')
const sample = require('lodash/sample');
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_PLACES_API_KEY,
  Promise
})

const foodTypes = [
  'bakery',
  'cafe',
  'restaurant'
]

const nightTypes = [
  'bar',
  'night_club'
]

const activityTypes = [
  'amusement_park',
  'aquarium',
  'art_gallery',
  'book_store',
  'bowling_alley',
  'casino',
  'library',
  'movie_theater',
  'museum',
  'park',
  'spa',
  'stadium',
  'zoo'
]

exports.activity = async function(req, res) {
  const { json } = await maps.places({
    location: [39.0976763,-77.03652979999998],
    radius: 5000,
    type: sample(activityTypes)
  })
  .asPromise()

  const activity = sample(json.results)
  res.json({ activity })
}

exports.food = async function(req, res) {
  const { json } = await maps.places({
    location: [39.0976763,-77.03652979999998],
    radius: 5000,
    type: sample(foodTypes)
  })
  .asPromise()

  const food = sample(json.results)
  res.json({ food })
}

exports.night = async function(req, res) {
  const { json } = await maps.places({
    location: [39.0976763,-77.03652979999998],
    radius: 5000,
    type: sample(nightTypes)
  })
  .asPromise()

  const night = sample(json.results)
  res.json({ night })
}
