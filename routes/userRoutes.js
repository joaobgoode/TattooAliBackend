const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../authentication/auth.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', auth.authenticateToken, userController.getMe);
router.post('/recuperar-senha', userController.recoverPassword);
router.post('/alterar-senha', userController.alterarSenha);



module.exports = router;