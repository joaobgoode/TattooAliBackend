const express = require('express');
const bairroController = require('../controllers/bairrocontroller.js');

const router = express.Router();

/** Lista de referência (id + nome); usada no cadastro antes do login. */
router.get('/', bairroController.getAll);

module.exports = router;
