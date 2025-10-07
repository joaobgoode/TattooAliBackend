const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const auth = require('../authentication/auth.js');

router.get("/sessoes/dia", auth.authenticateToken, dashboardController.getSessionsOfDay)
router.get("/sessoes/mes", auth.authenticateToken, dashboardController.getSessionsOfMonth)
router.get("/sessoes/ano", auth.authenticateToken, dashboardController.getSessionsOfYear)
router.get("/valor/dia", auth.authenticateToken, dashboardController.getSessionsValueOfDay)
router.get("/valor/mes", auth.authenticateToken, dashboardController.getSessionsValueOfMonth)
router.get("/valor/ano", auth.authenticateToken, dashboardController.getSessionsValueOfYear)

module.exports = router