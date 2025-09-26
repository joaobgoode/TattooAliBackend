const express = require('express');
const auth = require('../authentication/auth.js');
const styleController = require('../controllers/styleController');

const router = express.Router();

router.get('/', auth.authenticateToken, styleController.getAll);

module.exports = router;



