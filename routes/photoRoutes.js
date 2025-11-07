const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController.js');
const auth = require('../authentication/auth.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth.authenticateToken, upload.single('image'), photoController.uploadPhoto);
router.get('/', auth.authenticateToken, photoController.getUserPhotos);
router.get('/photo/:id', photoController.getPhotoById);
router.get('/user/:id', photoController.getPhotos);
router.delete('/:id', auth.authenticateToken, photoController.deletePhoto);
router.patch('/description/:id', auth.authenticateToken, photoController.updatePhotoDescription);

module.exports = router;
