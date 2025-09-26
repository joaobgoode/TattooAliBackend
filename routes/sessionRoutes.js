const express = require('express');
const auth = require('../authentication/auth.js');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.get('/', auth.authenticateToken, sessionController.getAll);
router.get('/pendentes', auth.authenticateToken, sessionController.getSessoesPendentes);
router.get('/realizadas', auth.authenticateToken, sessionController.getSessoesRealizadas);
router.get('/canceladas', auth.authenticateToken, sessionController.getSessoesCanceladas);
router.get('/realizadas/data', auth.authenticateToken, sessionController.getRealizadasByDate);
router.get('/canceladas/data', auth.authenticateToken, sessionController.getCanceladasByDate);
router.get('/cliente/:clienteId/pendentes', auth.authenticateToken, sessionController.getSessoesPendentesByClient);
router.get('/cliente/:clienteId/realizadas', auth.authenticateToken, sessionController.getSessoesRealizadasByClient);
router.get('/:id', auth.authenticateToken, sessionController.getById);
router.post('/', auth.authenticateToken, sessionController.createSession);
router.put('/:id', auth.authenticateToken, sessionController.updateSession);
router.put('/realizar/:id', auth.authenticateToken, sessionController.changeStatus);
router.delete('/:id', auth.authenticateToken, sessionController.deleteSession);

module.exports = router;



