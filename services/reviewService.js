const Review = require("../models/Review.js");
const client = require("../models/Client.js");
const User = require("../models/user.js");
const { Op } = require("sequelize");

function normalizeCpf(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

const includeCliente = {
  model: client,
  as: "cliente",
  attributes: ["client_id", "nome"],
};

const includeTatuador = {
  model: User,
  as: "tatuador",
  attributes: ["user_id", "nome", "sobrenome"],
};

async function getAllByClienteCpf(cpf) {
  const c = normalizeCpf(cpf);
  if (c.length !== 11) return [];
  const clientRows = await client.findAll({
    where: { cpf: c },
    attributes: ["client_id"],
  });
  const ids = clientRows.map((r) => r.client_id);
  if (!ids.length) return [];
  return Review.findAll({
    where: { cliente_id: { [Op.in]: ids } },
    include: [includeCliente, includeTatuador],
    order: [["createdAt", "DESC"]],
  });
}

async function createFromValidatedSession(session, { nota, comentario }) {
  const rawDate = session.getDataValue("data_atendimento");
  const existing = await Review.findOne({
    where: {
      cliente_id: session.cliente_id,
      usuario_id: session.usuario_id,
      data_sessao: rawDate,
    },
  });
  if (existing) {
    throw new Error("Já existe avaliação para esta sessão.");
  }
  return Review.create({
    cliente_id: session.cliente_id,
    usuario_id: session.usuario_id,
    data_sessao: rawDate,
    nota,
    comentario: comentario ?? "",
  });
}

async function findByPkForClienteCpf(reviewId, cpf) {
  const c = normalizeCpf(cpf);
  if (c.length !== 11) return null;
  return Review.findByPk(reviewId, {
    include: [
      {
        model: client,
        as: "cliente",
        where: { cpf: c },
        required: true,
        attributes: ["client_id", "cpf"],
      },
    ],
  });
}

async function updateReview(reviewId, cpf, patch) {
  const review = await findByPkForClienteCpf(reviewId, cpf);
  if (!review) return null;
  if (patch.nota !== undefined) review.nota = patch.nota;
  if (patch.comentario !== undefined) review.comentario = patch.comentario;
  await review.save();
  return review;
}

async function deleteReview(reviewId, cpf) {
  const review = await findByPkForClienteCpf(reviewId, cpf);
  if (!review) return false;
  await review.destroy();
  return true;
}

module.exports = {
  getAllByClienteCpf,
  createFromValidatedSession,
  findByPkForClienteCpf,
  updateReview,
  deleteReview,
};
