const express = require('express');
const router = require('express').Router();
const generateController = require('../controllers/generateController.js');
const auth = require('../authentication/auth.js');
const { isTatuador} = require('../authentication/authCheckRole.js');


router.post('/', auth.authenticateToken, isTatuador, generateController.generate);

module.exports = router;