const express = require('express');
const userControllers = require('../controllers/user.controller');

const router = express.Router();

router.get('/', (req, res) => {
	return res.status(200).json('Welcome to the user routes!');
});

router.get('/test', userControllers.TestController);

module.exports = router;
