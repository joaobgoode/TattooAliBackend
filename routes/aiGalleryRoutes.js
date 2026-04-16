const express = require('express');
const router = require('express').Router();
const generateController = require('../controllers/generateController.js');
const auth = require('../authentication/auth.js');

router.get('/', auth.requireTatuador, generateController.getAllGeneratedImages);
router.get('/:id', auth.requireTatuador, generateController.getGeneratedImageById);
router.delete('/:id', auth.requireTatuador, generateController.deleteGeneratedImage);

module.exports = router;