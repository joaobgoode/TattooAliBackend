const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const auth = require('../authentication/auth.js');

router.get("/sessions/day", auth.authenticateToken, dashboardController.getSessionsOfDay)
router.get("/sessions/month", auth.authenticateToken, dashboardController.getSessionsOfMonth)
router.get("/sessions/year", auth.authenticateToken, dashboardController.getSessionsOfYear)
router.get("/sessions/value/day", auth.authenticateToken, dashboardController.getSessionsValueOfDay)
router.get("/sessions/value/month", auth.authenticateToken, dashboardController.getSessionsValueOfMonth)
router.get("/sessions/value/year", auth.authenticateToken, dashboardController.getSessionsValueOfYear)

module.exports = router
