const express = require('express')
const unavailableDates = require('../controllers/unavailableDates.controller')

const router = express.Router()

router.get('/all', unavailableDates.getAll)

module.exports = router;