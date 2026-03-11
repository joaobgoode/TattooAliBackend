const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const auth = require('../authentication/auth.js');
const { isTatuador} = require('../authentication/authCheckRole.js');

router.get("/sessions/day", auth.authenticateToken, isTatuador, dashboardController.getSessionsOfDay)
router.get("/sessions/month", auth.authenticateToken, isTatuador, dashboardController.getSessionsOfMonth)
router.get("/sessions/year", auth.authenticateToken, isTatuador, dashboardController.getSessionsOfYear)
router.get("/sessions/value/day", auth.authenticateToken, isTatuador, dashboardController.getSessionsValueOfDay)
router.get("/sessions/value/month", auth.authenticateToken, isTatuador, dashboardController.getSessionsValueOfMonth)
router.get("/sessions/value/year", auth.authenticateToken, isTatuador, dashboardController.getSessionsValueOfYear)

module.exports = router
