const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController.js');
const auth = require('../authentication/auth.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/perfil/', auth.authenticateToken, upload.single('image'), imageController.uploadImage);

module.exports = router;
