const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const auth = require('../authentication/auth.js');

router.get("/sessions/day", auth.requireTatuador, dashboardController.getSessionsOfDay)
router.get("/sessions/month", auth.requireTatuador, dashboardController.getSessionsOfMonth)
router.get("/sessions/year", auth.requireTatuador, dashboardController.getSessionsOfYear)
router.get("/sessions/value/day", auth.requireTatuador, dashboardController.getSessionsValueOfDay)
router.get("/sessions/value/month", auth.requireTatuador, dashboardController.getSessionsValueOfMonth)
router.get("/sessions/value/year", auth.requireTatuador, dashboardController.getSessionsValueOfYear)

module.exports = router
