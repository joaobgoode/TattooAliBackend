const express = require('express');
const auth = require('../authentication/auth.js');
const perfilController = require('../controllers/perfilController');

const router = express.Router();

router.get('/perfil', auth.authenticateToken, perfilController.getPerfil);
router.delete('/perfil', auth.authenticateToken, perfilController.deletePerfil);
router.put('/perfil', auth.authenticateToken, perfilController.updatePerfil);

module.exports = router;
