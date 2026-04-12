const express = require('express');
const auth = require('../authentication/auth.js');
const tatuadorController = require('../controllers/tatuadorController.js');

const router = express.Router();

router.get('/search', auth.authenticateToken, tatuadorController.searchTatuadores);
router.get('/bairro/:bairro_id', auth.authenticateToken, tatuadorController.getByBairro);
router.get('/:user_id/photos', auth.authenticateToken, tatuadorController.getUserPhotos);
router.get('/:user_id/styles', auth.authenticateToken, tatuadorController.getUserStyles);
router.get('/:user_id/reviews', auth.authenticateToken, tatuadorController.getUserReviews);
router.get('/:user_id', auth.authenticateToken, tatuadorController.getUserPerfil);

module.exports = router;
