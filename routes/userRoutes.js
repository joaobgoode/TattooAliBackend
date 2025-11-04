const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/recuperar-senha', userController.recoverPassword);
router.post('/alterar-senha', userController.alterarSenha);


module.exports = router;