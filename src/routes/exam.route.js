const express = require('express');
const examController = require('../controllers/exam.controller');

const router = express.Router();

router.post('/create', examController.create);
router.post('/get/:id', examController.get);
router.post('/getAll', examController.getAll);
router.put('/update/:id', examController.update);
router.delete('/delete/:id', examController.delete);

module.exports = router;
