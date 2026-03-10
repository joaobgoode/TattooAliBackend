const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController.js');
const auth = require('../authentication/auth.js');
const {isTatuador} = require('../authentication/authCheckRole.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth.authenticateToken, isTatuador, upload.single('image'), photoController.uploadPhoto);
router.get('/', auth.authenticateToken, isTatuador, photoController.getUserPhotos);
router.delete('/:id', auth.authenticateToken, isTatuador, photoController.deletePhoto);
router.patch('/description/:id', auth.authenticateToken, isTatuador, photoController.updatePhotoDescription);

router.get('/photo/:id', photoController.getPhotoById);
router.get('/user/:id', photoController.getPhotos);

module.exports = router;
