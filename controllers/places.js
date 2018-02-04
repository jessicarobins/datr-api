const Promise = require('bluebird')
const sample = require('lodash/sample');
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_PLACES_API_KEY,
  Promise
})

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

exports.activity = async function(req, res) {
  await sendPlaceJson({
    res,
    type: 'activity',
    location: [39.0976763,-77.03652979999998]
  })
}

exports.food = async function(req, res) {
  await sendPlaceJson({
    res,
    type: 'food',
    location: [39.0976763,-77.03652979999998]
  })
}

exports.night = async function(req, res) {
  await sendPlaceJson({
    res,
    type: 'night',
    location: [39.0976763,-77.03652979999998]
  })
}

async function sendPlaceJson({ type, location, res }) {
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

  const { website, name, formatted_address } = { ...place, ...response.json.result }

  return Promise.resolve({ website, name, formatted_address, type })
}

async function getPlaceJson({ type, location }) {
  const { json } = await maps.places({
    location,
    radius: 5000,
    type
  })
  .asPromise()

  return json
}
