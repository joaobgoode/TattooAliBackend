const express = require('express')
const router = require('express').Router();
const auth = require('../authentication/auth.js');
const reportController = require('../controllers/reportController.js')

router.post('/', auth.authenticateToken, reportController.createReport);
router.get('/all',auth.authenticateToken, reportController.getAllReports);
router.get('/:id', auth.authenticateToken, reportController.getReportById);
router.patch('/:id/status', auth.authenticateToken, reportController.updateReportStatus);
router.delete('/:id', auth.authenticateToken, reportController.deleteReport);


module.exports = router;