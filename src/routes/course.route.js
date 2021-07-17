const express = require('express');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.post('/create', courseController.create);
router.post('/get/:id', courseController.get);
router.post('/getAll', courseController.getAll);
router.put('/update/:id', courseController.update);
router.delete('/delete/:id', courseController.delete);

module.exports = router;