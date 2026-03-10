const express = require('express');
const auth = require('../authentication/auth.js');
const styleController = require('../controllers/styleController');
const { isTatuador} = require('../authentication/authCheckRole.js');

const router = express.Router();

router.get('/', auth.authenticateToken,  isTatuador, styleController.getAll);

module.exports = router;



