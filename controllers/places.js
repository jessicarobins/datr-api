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
  restaurant: [
    'bakery',
    'cafe',
    'restaurant'
  ],
  bar: [
    'bar',
    'night_club'
  ]
}

exports.index = async function(req, res) {
  const { latitude, longitude, zipcode, radius, categories } = req.query

  const categoriesObject = categories ? JSON.parse(categories) : typesObject

  try {
    let location
    if (latitude && longitude) {
      location = [req.query.latitude, req.query.longitude]
    } else if (zipcode) {
      location = await getCoordsFromZipcode(zipcode)
    } else {
      return res.status(422).send('Zipcode or latitude and longitude are required.')
    }

    const promiseMap = {}

    Object.entries(categoriesObject).forEach(([key, value]) => {
      promiseMap[key] = getPlaceOfType({ types: value, location, radius })
    })

    const response = await Promise.props(promiseMap)

    res.json(response)
  } catch(err) {
    console.log(err)
    res.status(404).send(err)
  }
}

async function getPlaceOfType({ types, location, radius }) {
  let type
  let placeJson

  for(let i = 0; i < 4; i++) {
    type = sample(types)
    placeJson = await getPlaceJson({ type, location, radius })

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

async function getPlaceJson({ type, location, radius = 2000 }) {
  const { json } = await maps.placesNearby({
    location,
    radius: parseInt(radius, 10),
    type
  })
  .asPromise()

  return json
}
