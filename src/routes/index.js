const express = require('express');
const userRoutes = require('./user.route');
const examRoutes = require('./exam.route');
const roomRoutes = require('./room.routes');
const examRoomRoutes = require('./examRoom.routes');
const invigilatorsAllottedRoutes = require('./invigilatorsAllotted.routes');
const invigilatorRoutes = require('./invigilator.route');
const courseRoutes = require('./course.route');
const scheduleRoutes = require('./schedule.route');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/exam', examRoutes);
router.use('/room', roomRoutes);
router.use('/examroom', examRoomRoutes);
router.use('/allotted', invigilatorsAllottedRoutes)
router.use('/invigilator', invigilatorRoutes);
router.use('/course', courseRoutes);
router.use('/schedule', scheduleRoutes);

module.exports = router;
