const express = require('express');
const userRoutes = require('./user.route');
const examRoutes = require('./exam.route');
const roomRoutes = require('./room.routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/exam', examRoutes);
router.use('/room', roomRoutes);

module.exports = router;
