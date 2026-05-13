const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const auth = require('../authentication/auth');

router.post('/', auth, estudioController.createEstudio);
router.get('/', auth, estudioController.getEstudios);
router.get('/:id', auth, estudioController.getEstudioById);
router.put('/:id', auth, estudioController.updateEstudio);
router.delete('/:id', auth, estudioController.deleteEstudio);

module.exports = router;