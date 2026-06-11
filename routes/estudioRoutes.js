const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const auth = require('../authentication/auth.js');

router.post('/', auth.requireTatuador, estudioController.createEstudio);
router.get('/', auth.requireTatuador, estudioController.getEstudios);
router.get('/:id', auth.requireTatuador, estudioController.getEstudioById);
router.put('/:id', auth.requireTatuador, estudioController.updateEstudio);
router.delete('/:id', auth.requireTatuador, estudioController.deleteEstudio);

module.exports = router;