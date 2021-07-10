const express = require('express');
const userRoutes = require('./user.route');
const examRoutes = require('./exam.route');
const roomRoutes = require('./room.routes');
const examRoomRoutes = require('./examRoom.routes');
const invigilatorsAllottedRoutes = require('./invigilatorsAllotted.routes.js');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/exam', examRoutes);
router.use('/room', roomRoutes);
router.use('/examroom', examRoomRoutes);
router.use('/allotted', invigilatorsAllottedRoutes)

module.exports = router;
