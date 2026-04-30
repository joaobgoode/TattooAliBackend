const reviewReplyService = require("../services/reviewReplyService");
const User = require("../models/user.js");

function normalizeCpf(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

async function cpfFromAuthenticatedUser(req) {
  const fromMiddleware = req.userData?.cpf;
  const midDigits = normalizeCpf(fromMiddleware);
  if (midDigits.length === 11) {
    return fromMiddleware;
  }
  const id = req.user?.id;
  if (!id) return null;
  const row = await User.findByPk(id, { attributes: ["cpf"] });
  return row?.cpf ?? null;
}

function validarResposta(resposta) {
  return (
    typeof resposta === "string" &&
    resposta.trim().length > 0 &&
    resposta.length <= 500
  );
}

function parseId(raw) {
  const id = Number.parseInt(String(raw), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

async function listReplies(req, res) {
  const reviewId = parseId(req.params.reviewId);
  if (!reviewId) return res.status(400).json({ error: "reviewId inválido" });

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (normalizeCpf(cpf).length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const replies = await reviewReplyService.listByReview(
      reviewId,
      req.user?.id,
      cpf
    );
    if (!replies) {
      return res.status(403).json({ error: "Acesso negado para esta avaliação." });
    }
    return res.status(200).json(replies);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createReply(req, res) {
  const reviewId = parseId(req.params.reviewId);
  const resposta = req.body.resposta == null ? "" : String(req.body.resposta);
  if (!reviewId) return res.status(400).json({ error: "reviewId inválido" });
  if (!validarResposta(resposta)) {
    return res.status(400).json({ error: "Resposta inválida" });
  }

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (normalizeCpf(cpf).length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const reply = await reviewReplyService.createReply(
      reviewId,
      req.user?.id,
      cpf,
      resposta.trim()
    );
    if (!reply) {
      return res.status(403).json({ error: "Acesso negado para esta avaliação." });
    }
    return res.status(201).json(reply);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function updateReply(req, res) {
  const reviewId = parseId(req.params.reviewId);
  const replyId = parseId(req.params.replyId);
  const resposta = req.body.resposta == null ? "" : String(req.body.resposta);
  if (!reviewId) return res.status(400).json({ error: "reviewId inválido" });
  if (!replyId) return res.status(400).json({ error: "replyId inválido" });
  if (!validarResposta(resposta)) {
    return res.status(400).json({ error: "Resposta inválida" });
  }

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (normalizeCpf(cpf).length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const updated = await reviewReplyService.updateReply(
      reviewId,
      replyId,
      req.user?.id,
      cpf,
      resposta.trim()
    );
    if (updated === null) {
      return res.status(403).json({ error: "Acesso negado para esta avaliação." });
    }
    if (updated === false) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }
    if (updated === "forbidden") {
      return res.status(403).json({ error: "Apenas o autor pode editar a resposta." });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteReply(req, res) {
  const reviewId = parseId(req.params.reviewId);
  const replyId = parseId(req.params.replyId);
  if (!reviewId) return res.status(400).json({ error: "reviewId inválido" });
  if (!replyId) return res.status(400).json({ error: "replyId inválido" });

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (normalizeCpf(cpf).length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const removed = await reviewReplyService.deleteReply(
      reviewId,
      replyId,
      req.user?.id,
      cpf
    );
    if (removed === null) {
      return res.status(403).json({ error: "Acesso negado para esta avaliação." });
    }
    if (removed === false) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }
    if (removed === "forbidden") {
      return res.status(403).json({ error: "Apenas o autor pode remover a resposta." });
    }
    return res.status(200).json({ message: "Resposta removida com sucesso." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listReplies,
  createReply,
  updateReply,
  deleteReply,
};
