const express = require('express');
const auth = require('../authentication/auth.js');
const perfilController = require('../controllers/perfilController');

const router = express.Router();

router.get('/', auth.authenticateToken, perfilController.getPerfil);
router.delete('/', auth.authenticateToken, perfilController.deletePerfil);
router.put('/', auth.authenticateToken, perfilController.updatePerfil);

module.exports = router;
