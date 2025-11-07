const express = require('express');
const router = require('express').Router();
const generateController = require('../controllers/generateController.js');
const auth = require('../authentication/auth.js');


router.get('/', auth.authenticateToken, generateController.getAllGeneratedImages);
router.get('/:id', auth.authenticateToken, generateController.getGeneratedImageById);
router.delete('/:id', auth.authenticateToken, generateController.deleteGeneratedImage);

module.exports = router;