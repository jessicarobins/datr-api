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

exports.index = async function(req, res) {
  const location = [req.query.latitude, req.query.longitude]
  try {
    const response = await Promise.props({
      activity: getPlaceOfType({ types: typesObject['activity'], location }),
      food: getPlaceOfType({ types: typesObject['food'], location }),
      night: getPlaceOfType({ types: typesObject['night'], location })
    })

    res.json(response)
  } catch(err) {
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
