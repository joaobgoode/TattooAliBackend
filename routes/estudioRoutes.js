const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const auth = require('../authentication/auth'); // O objeto auth importado

// Usando o auth.authenticateToken conforme a dica do seu amigo:
router.post('/', auth.authenticateToken, estudioController.createEstudio);
router.get('/', auth.authenticateToken, estudioController.getEstudios);
router.get('/:id', auth.authenticateToken, estudioController.getEstudioById);
router.put('/:id', auth.authenticateToken, estudioController.updateEstudio);
router.delete('/:id', auth.authenticateToken, estudioController.deleteEstudio);

module.exports = router;