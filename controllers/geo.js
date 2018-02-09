const get = require('lodash/get')

const { getCoordsFromZipcode, getZipcodeFromCoords } = require('./util')

exports.coords = async function(req, res) {
  const zipcode = get(req, 'query.zipcode', null)
  if (!zipcode) {
    return res.status(422).send('Zipcode is required')
  }

  try {
    const location = await getCoordsFromZipcode(zipcode)
    res.json(location)
  } catch(err) {
    console.log('error: ', err)
    res.status(404).send(err)
  }
}

exports.zipcode = async function(req, res) {
  const { latitude, longitude } = req.query
  if (!latitude || !longitude) {
    return res.status(422).send('Latitude and longitude are required')
  }

  try {
    const location = await getZipcodeFromCoords({ latitude, longitude })
    res.json(location)
  } catch(err) {
    console.log('error: ', err)
    res.status(404).send(err)
  }
}
