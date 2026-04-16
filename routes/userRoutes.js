const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../authentication/auth.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', auth.authenticateToken, userController.getMe);
router.post('/recuperar-senha', userController.recoverPassword);
router.post('/alterar-senha', userController.alterarSenha);
router.post('/upload-foto', auth.authenticateToken, upload.single('image'), userController.uploadProfilePhoto);



module.exports = router;