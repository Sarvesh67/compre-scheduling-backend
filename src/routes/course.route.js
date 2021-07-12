const express = require('express');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.post('/create', courseController.create);
router.get('/get/:id', courseController.get);
router.get('/getAll', courseController.getAll);
router.put('/update/:id', courseController.update);
router.delete('/delete/:id', courseController.delete);

module.exports = router;