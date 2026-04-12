const reviewService = require("../services/reviewService");
const sessionService = require("../services/sessionService");
const User = require("../models/user.js");

async function cpfFromAuthenticatedUser(req) {
  const fromMiddleware = req.userData?.cpf;
  const midDigits = String(fromMiddleware || "").replace(/\D/g, "");
  if (midDigits.length === 11) {
    return fromMiddleware;
  }
  const id = req.user?.id;
  if (!id) return null;
  const row = await User.findByPk(id, { attributes: ["cpf"] });
  return row?.cpf ?? null;
}

function validarNota(nota) {
  const n = Number(nota);
  return Number.isInteger(n) && n >= 1 && n <= 5;
}

function validarComentario(comentario) {
  return typeof comentario === "string" && comentario.length <= 500;
}

async function postReview(req, res) {
  const sessao_id = Number.parseInt(String(req.body.sessao_id), 10);
  const nota = Number(req.body.nota);
  const comentario =
    req.body.comentario == null ? "" : String(req.body.comentario);

  if (!Number.isFinite(sessao_id) || sessao_id < 1) {
    return res.status(400).json({ error: "sessao_id inválido" });
  }

  if (!validarNota(nota) || !validarComentario(comentario)) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (String(cpf || "").replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }

    const session = await sessionService.getSessaoByIdForClienteCpf(
      sessao_id,
      cpf
    );
    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada." });
    }
    if (!session.realizado || session.cancelado) {
      return res
        .status(400)
        .json({ error: "Só é possível avaliar sessões concluídas." });
    }

    const analiseRegistro = await reviewService.createFromValidatedSession(
      session,
      { nota, comentario }
    );
    return res.status(201).json(analiseRegistro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getReviews(req, res) {
  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (String(cpf || "").replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const reviews = await reviewService.getAllByClienteCpf(cpf);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteReview(req, res) {
  const { id } = req.params;

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (String(cpf || "").replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const removed = await reviewService.deleteReview(id, cpf);
    if (!removed) {
      return res.status(404).json({ error: "Análise não encontrada" });
    }
    return res.status(200).json({ message: "Análise removido com sucesso" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function updateReview(req, res) {
  const { id } = req.params;
  const { nota, comentario } = req.body;

  if (nota !== undefined && !validarNota(nota)) {
    return res.status(400).json({ error: "Nota inválida" });
  }
  if (comentario !== undefined && !validarComentario(comentario)) {
    return res.status(400).json({ error: "Comentário inválido" });
  }

  try {
    const cpf = await cpfFromAuthenticatedUser(req);
    if (String(cpf || "").replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "CPF não encontrado no cadastro." });
    }
    const patch = {};
    if (nota !== undefined) patch.nota = nota;
    if (comentario !== undefined) patch.comentario = comentario;
    const updatedReview = await reviewService.updateReview(id, cpf, patch);
    if (!updatedReview) {
      return res.status(404).json({ error: "Análise não encontrada" });
    }
    return res.status(200).json(updatedReview);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  postReview,
  getReviews,
  updateReview,
  deleteReview,
};
