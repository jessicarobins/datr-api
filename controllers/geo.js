const maps = require('../config/google')

exports.coords = async function(req, res) {
  if (!req.query.zipcode) {
    res.status(422).send('Zipcode is required')
  }

  try {
    const { json } = await maps.geocode({
      address: req.query.zipcode
    }).asPromise()

    res.json(json.results)
  } catch(err) {
    console.log('error: ', err)
    res.status(500).send(err)
  }

}
