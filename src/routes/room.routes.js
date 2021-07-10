const express = require('express');
const roomController = require('../controllers/room.controller');

const router = express.Router();

router.get('/get/:id', roomController.get);
router.get('/getAll', roomController.getAll);

module.exports = router;
