const express = require('express');
const userControllers = require('../controllers/user.controller');

const router = express.Router();

router.post('/', userControllers.getAll);
router.post('/login', userControllers.login);
router.post('/create', userControllers.create);
router.delete('/', userControllers.purgeAll);
router.delete('/:id', userControllers.deleteUser);
router.post('/schedules', userControllers.getSchedules);

module.exports = router;
