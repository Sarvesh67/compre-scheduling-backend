const express = require('express');
const examController = require('../controllers/exam.controller');

const router = express.Router();

router.post('/create', examController.create);
router.get('/get/:id', examController.get);
router.get('/getAll', examController.getAll);
router.put('/update/:id', examController.update);
router.delete('/delete/:id', examController.delete);

module.exports = router;
