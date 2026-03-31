const express = require('express');
const auth = require('../authentication/auth.js');
const bairroController = require('../controllers/bairrocontroller.js');

const router = express.Router();

router.get('/', auth.authenticateToken, bairroController.getAll);

module.exports = router;
