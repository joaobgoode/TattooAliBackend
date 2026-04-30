const express = require('express');
const auth = require('../authentication/auth.js');
const notificationController = require('../controllers/notificationController.js');

const router = express.Router();

router.get('/me', auth.authenticateToken, notificationController.getMyNotifications);
router.get('/', auth.authenticateToken, notificationController.getMyNotifications);
router.put('/me/read-all', auth.authenticateToken, notificationController.markAllAsRead);
router.put('/read-all', auth.authenticateToken, notificationController.markAllAsRead);
router.put('/:id/read', auth.authenticateToken, notificationController.markOneAsRead);

module.exports = router;
