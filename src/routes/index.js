const express = require('express');
const userRoutes = require('./user.route');
const examRoutes = require('./exam.route');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/exam', examRoutes);

module.exports = router;
