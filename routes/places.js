const express = require('express')
const router = express.Router()
const PlacesController = require('../controllers/places')

router.get('/activity', PlacesController.activity)

module.exports = router
