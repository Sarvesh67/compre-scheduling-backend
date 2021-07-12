const express = require('express')
const scheduleControllers = require('../controllers/schedule.controller');
const { route } = require('./user.route');

const router = express.Router()

router.get('/', scheduleControllers.getAll);
router.post('/:userId', scheduleControllers.create);
router.delete('/:id', scheduleControllers.delete);
router.put('/:id', scheduleControllers.update);

module.exports = router;