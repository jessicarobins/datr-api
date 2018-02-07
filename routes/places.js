const express = require('express')
const router = express.Router()
const PlacesController = require('../controllers/places')

router.get('/activity', PlacesController.activity)
router.get('/food', PlacesController.food)
router.get('/night', PlacesController.night)
router.get('/', PlacesController.index)

module.exports = router
