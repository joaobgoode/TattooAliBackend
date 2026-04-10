const express = require('express');
const auth = require('../authentication/auth.js');
const router = require('express').Router();
const reviewController = require('../controllers/reviewController.js')


router.post('/', auth.authenticateToken, reviewController.postReview)
router.get('/all', auth.authenticateToken, reviewController.getReviews)
router.delete('/:id', auth.authenticateToken, reviewController.deleteReview)
router.patch('/:id', auth.authenticateToken, reviewController.updateReview)

module.exports = router;