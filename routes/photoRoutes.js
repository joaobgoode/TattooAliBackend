const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController.js');
const auth = require('../authentication/auth.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth.requireTatuador, upload.single('image'), photoController.uploadPhoto);
router.get('/', auth.requireTatuador, photoController.getUserPhotos);
router.delete('/:id', auth.requireTatuador, photoController.deletePhoto);
router.patch('/description/:id', auth.requireTatuador, photoController.updatePhotoDescription);

router.get('/photo/:id', photoController.getPhotoById);
router.get('/user/:id', photoController.getPhotos);

module.exports = router;
