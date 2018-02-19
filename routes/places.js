const express = require('express')
const router = express.Router()
const PlacesController = require('../controllers/places')

router.get('/', PlacesController.index)

module.exports = router
