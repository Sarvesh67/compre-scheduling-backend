const express = require('express');
const outputController = require('../controllers/output.controller');

const router = express.Router();

router.get('/one/:schedId', outputController.getOutput1);
router.get('/two/:schedId', outputController.getOutput2);
router.get('/three/:schedId/:bitsId', outputController.getOutput3);
router.get('/four/:schedId/:invigilatorId', outputController.getOutput4);
router.get('/five/:schedId', outputController.getOutput5);
router.get('/six/:schedId', outputController.getOutput6);
router.get('/seven/:schedId', outputController.getOutput7);

module.exports = router;
