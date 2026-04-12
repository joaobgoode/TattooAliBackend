const express = require('express');
const auth = require('../authentication/auth.js');
const sessionController = require('../controllers/sessionController.js');
const router = express.Router();

/**
 * Agenda “como cliente” por CPF (vínculo com Clients).
 * authenticateToken: qualquer usuário logado com CPF pode ver as próprias sessões,
 * mesmo se role no Postgres estiver incorreto (ex.: cliente listado como tatuador).
 */
router.get('/me/pendentes', auth.authenticateToken, sessionController.getMySessionsPending);
router.get('/me/realizadas', auth.authenticateToken, sessionController.getMySessionsRealized);
router.get('/me/canceladas', auth.authenticateToken, sessionController.getMySessionsCanceled);

// Rotas para mobile (legado)
router.get('/:id/history', auth.requireCliente, sessionController.getClientSessionsPast);
router.get('/:id/future', auth.requireCliente, sessionController.getClientSessionsFuture);
router.get('/:id/today', auth.requireCliente, sessionController.getClientSessionsToday);
router.get('/:id', auth.requireCliente, sessionController.getClientSessionsByCPF);

module.exports = router;
