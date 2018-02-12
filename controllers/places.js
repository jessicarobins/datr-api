const Promise = require('bluebird')
const sample = require('lodash/sample')
const maps = require('../config/google')
const { getCoordsFromZipcode } = require('./util')

const typesObject = {
  activity: [
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
  ],
  food: [
    'bakery',
    'cafe',
    'restaurant'
  ],
  night: [
    'bar',
    'night_club'
  ]
}

exports.index = async function(req, res) {
  const { latitude, longitude, zipcode } = req.query

  try {
    let location
    if (latitude && longitude) {
      location = [req.query.latitude, req.query.longitude]
    } else if (zipcode) {
      location = await getCoordsFromZipcode(zipcode)
    } else {
      return res.status(422).send('Zipcode or latitude and longitude are required.')
    }
    const response = await Promise.props({
      activity: getPlaceOfType({ types: typesObject['activity'], location }),
      food: getPlaceOfType({ types: typesObject['food'], location }),
      night: getPlaceOfType({ types: typesObject['night'], location })
    })

    res.json(response)
  } catch(err) {
    console.log(err)
    res.status(404).send(err)
  }
}

exports.activity = sendPlaceJson.bind(null, 'activity')

exports.food = sendPlaceJson.bind(null, 'food')

exports.night = sendPlaceJson.bind(null, 'night')

async function sendPlaceJson(type, req, res) {
  const location = [req.query.latitude, req.query.longitude]

  try {
    const result = await getPlaceOfType({
      types: typesObject[type],
      location
    })
    res.json({ [type]: result })
  } catch(err) {
    console.log(err)
    res.status(404).send(err)
  }
}

async function getPlaceOfType({ types, location }) {
  let type
  let placeJson

  for(let i = 0; i < 4; i++) {
    type = sample(types)
    placeJson = await getPlaceJson({ type, location })

    if (placeJson.results.length > 0 ) {
      break;
    }
  }

  if (placeJson.results.length === 0 ) {
    return Promise.reject('No results found')
  }

  const place = sample(placeJson.results)

  const response = await maps.place({
    placeid: place.place_id
  }).asPromise()

  return Promise.resolve({ ...place, ...response.json.result, type })
}

async function getPlaceJson({ type, location }) {
  const { json } = await maps.placesNearby({
    location,
    radius: 2000,
    type
  })
  .asPromise()

  return json
}
