const express = require('express');
const auth = require('../authentication/auth.js');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');
const reviewReplyController = require("../controllers/reviewReplyController.js");

// Autenticação por JWT; quem pode avaliar é quem tem CPF batendo com o cliente da sessão (validado no controller).
// requireCliente bloqueava contas role "tatuador" que também são clientes na agenda de outro artista.
router.post('/', auth.authenticateToken, reviewController.postReview);
router.get('/all', auth.authenticateToken, reviewController.getReviews);
router.delete('/:id', auth.authenticateToken, reviewController.deleteReview);
router.patch('/:id', auth.authenticateToken, reviewController.updateReview);
router.get(
  "/:reviewId/respostas",
  auth.authenticateToken,
  reviewReplyController.listReplies
);
router.post(
  "/:reviewId/respostas",
  auth.authenticateToken,
  reviewReplyController.createReply
);
router.patch(
  "/:reviewId/respostas/:replyId",
  auth.authenticateToken,
  reviewReplyController.updateReply
);
router.delete(
  "/:reviewId/respostas/:replyId",
  auth.authenticateToken,
  reviewReplyController.deleteReply
);

module.exports = router;