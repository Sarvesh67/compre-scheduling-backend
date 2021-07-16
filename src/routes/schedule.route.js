const express = require('express')
const scheduleControllers = require('../controllers/schedule.controller');
const { route } = require('./user.route');

const router = express.Router()

router.post('/', scheduleControllers.getAll);
router.post('/:userId', scheduleControllers.create);
router.delete('/:id', scheduleControllers.delete);
router.put('/:id', scheduleControllers.update);
router.post('/:id', scheduleControllers.get);

module.exports = router;