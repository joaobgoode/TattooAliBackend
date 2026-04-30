const Review = require("../models/Review.js");
const ReviewReply = require("../models/ReviewReply.js");
const Client = require("../models/Client.js");
const User = require("../models/user.js");

function normalizeCpf(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

async function getReviewWithAccess(reviewId, userId, cpf) {
  const review = await Review.findByPk(reviewId, {
    include: [
      {
        model: Client,
        as: "cliente",
        attributes: ["client_id", "cpf"],
      },
    ],
  });
  if (!review) return null;

  const cpfDigits = normalizeCpf(cpf);
  const isCliente = normalizeCpf(review.cliente?.cpf) === cpfDigits;
  const isTatuador = Number(review.usuario_id) === Number(userId);

  if (!isCliente && !isTatuador) return null;
  return {
    review,
    actorType: isTatuador ? "tatuador" : "cliente",
  };
}

async function listByReview(reviewId, userId, cpf) {
  const access = await getReviewWithAccess(reviewId, userId, cpf);
  if (!access) return null;
  const replies = await ReviewReply.findAll({
    where: { review_id: reviewId },
    include: [
      {
        model: User,
        as: "autor",
        attributes: ["user_id", "nome", "sobrenome"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });
  return replies;
}

async function createReply(reviewId, userId, cpf, resposta) {
  const access = await getReviewWithAccess(reviewId, userId, cpf);
  if (!access) return null;
  return ReviewReply.create({
    review_id: access.review.review_id,
    autor_id: userId,
    autor_tipo: access.actorType,
    resposta,
  });
}

async function updateReply(reviewId, replyId, userId, cpf, resposta) {
  const access = await getReviewWithAccess(reviewId, userId, cpf);
  if (!access) return null;

  const reply = await ReviewReply.findOne({
    where: { review_id: reviewId, review_reply_id: replyId },
  });
  if (!reply) return false;
  if (Number(reply.autor_id) !== Number(userId)) return "forbidden";

  reply.resposta = resposta;
  await reply.save();
  return reply;
}

async function deleteReply(reviewId, replyId, userId, cpf) {
  const access = await getReviewWithAccess(reviewId, userId, cpf);
  if (!access) return null;

  const reply = await ReviewReply.findOne({
    where: { review_id: reviewId, review_reply_id: replyId },
  });
  if (!reply) return false;
  if (Number(reply.autor_id) !== Number(userId)) return "forbidden";

  await reply.destroy();
  return true;
}

module.exports = {
  listByReview,
  createReply,
  updateReply,
  deleteReply,
};
