const express = require('express');
const examRoomController = require('../controllers/examRoom.controller');

const router = express.Router();

router.post('/create', examRoomController.create);
router.post('/get/:id', examRoomController.get);
router.post('/getAll', examRoomController.getAll);
router.put('/update/:id', examRoomController.update);
router.delete('/delete/:id', examRoomController.delete);

module.exports = router;
