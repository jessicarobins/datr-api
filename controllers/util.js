const get = require('lodash/get')
const maps = require('../config/google')

exports.getCoordsFromZipcode = async function(zipcode) {
  const { json } = await maps.geocode({
    address: zipcode
  }).asPromise()

  const location = get(json, 'results[0].geometry.location', null)

  if (location) {
    return Promise.resolve({
      latitude: location.lat,
      longitude: location.lng
    })
  }

  return Promise.reject(new Error(`No results found for ${zipcode}.`))
}

exports.getZipcodeFromCoords = async function({ latitude, longitude }) {
  const { json } = await maps.reverseGeocode({
    latlng: [latitude, longitude],
    result_type: 'postal_code'
  }).asPromise()

  const zipcode = get(json, 'results[0].address_components[0].long_name', null)

  if (zipcode) {
    return Promise.resolve({ zipcode })
  }

  return Promise.reject(new Error(`No results found.`))
}
