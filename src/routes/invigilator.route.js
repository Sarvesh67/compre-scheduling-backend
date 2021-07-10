const express = require('express');
const invigilatorController = require('../controllers/invigilator.controller');

const router = express.Router();

router.post('/create', invigilatorController.create);
router.get('/get/:id', invigilatorController.get);
router.get('/getAll', invigilatorController.getAll);
router.put('/update/:id', invigilatorController.update);
router.delete('/delete/:id', invigilatorController.delete);

module.exports = router;