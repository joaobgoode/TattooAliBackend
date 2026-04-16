const express = require('express');
const auth = require('../authentication/auth.js');
const styleController = require('../controllers/styleController');

const router = express.Router();

/** Catálogo de estilos: qualquer usuário autenticado (ex.: cliente filtrando busca no app). */
router.get('/', auth.authenticateToken, styleController.getAll);

module.exports = router;



