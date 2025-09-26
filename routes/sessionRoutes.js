const express = require('express');
const auth = require('../authentication/auth.js');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.get('/', auth.authenticateToken, sessionController.getAll);
router.get('/:id', auth.authenticateToken, sessionController.getById);
router.post('/', auth.authenticateToken, sessionController.createSession);
router.put('/:id', auth.authenticateToken, sessionController.updateSession);
router.put('/realizar/:id', auth.authenticateToken, sessionController.changeStatus);
router.delete('/:id', auth.authenticateToken, sessionController.deleteSession);

module.exports = router;



