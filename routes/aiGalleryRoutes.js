const express = require('express');
const router = require('express').Router();
const generateController = require('../controllers/generateController.js');
const auth = require('../authentication/auth.js');
const { isTatuador} = require('../authentication/authCheckRole.js');

router.get('/', auth.authenticateToken, isTatuador, generateController.getAllGeneratedImages);
router.get('/:id', auth.authenticateToken, isTatuador, generateController.getGeneratedImageById);
router.delete('/:id', auth.authenticateToken, isTatuador, generateController.deleteGeneratedImage);

module.exports = router;