const express = require('express');
const auth = require('../authentication/auth.js');
const sessionController = require('../controllers/sessionController.js');
const { isTatuador, isCliente} = require('../authentication/authCheckRole.js');
const router = express.Router();

// Rotas para mobile
router.get('/:id/history', auth.authenticateToken, isCliente, sessionController.getClientSessionsPast);
router.get('/:id/future', auth.authenticateToken, isCliente, sessionController.getClientSessionsFuture);
router.get('/:id/today', auth.authenticateToken, isCliente, sessionController.getClientSessionsToday);
router.get('/:id', auth.authenticateToken, isCliente, sessionController.getClientSessionsByCPF);

module.exports = router;
