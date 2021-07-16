const express = require('express');
const roomController = require('../controllers/room.controller');

const router = express.Router();

router.post('/get/:id', roomController.get);
router.post('/getAll', roomController.getAll);
router.post('/create', roomController.create);

module.exports = router;
