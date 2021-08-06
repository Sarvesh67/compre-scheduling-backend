const express = require('express');
const outputController = require('../controllers/output.controller');

const router = express.Router();

router.get('/one/:schedId', outputController.getOutput1);
router.get('/two/:schedId', outputController.getOutput2);
router.get('/three/:bitsId', outputController.getOutput3);
router.get('/four/:invigilatorId', outputController.getOutput4);
router.get('/five/:schedId', outputController.getOutput5);

module.exports = router;
