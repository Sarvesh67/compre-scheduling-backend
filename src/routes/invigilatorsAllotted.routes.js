const express = require('express');
const invigilatorsAllottedController = require('../controllers/invigilatorsAllotted.controller');

const router = express.Router();

router.post('/create', invigilatorsAllottedController.create);
router.post('/get/:id', invigilatorsAllottedController.get);
router.post('/getAll', invigilatorsAllottedController.getAll);
router.put('/update/:id', invigilatorsAllottedController.update);
router.delete('/delete/:id', invigilatorsAllottedController.delete);

module.exports = router;
