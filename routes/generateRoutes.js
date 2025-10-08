const express = require('express');
const router = require('express').Router();
const generateController = require('../controllers/generateController.js');
const auth = require('../authentication/auth.js');


router.post('/', auth.authenticateToken, generateController.generate);

module.exports = router;