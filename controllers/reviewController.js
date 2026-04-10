const reviewService = require("../services/reviewService");
const clientService = require("../services/clientService");

function validarNota(nota) {
  return typeof nota === "number" && nota > 0 && nota <= 5;
}

function validarComentario(comentario) {
  return typeof comentario === "string" && comentario.length <= 500;
}

async function postReview(req, res) {
  const { data_sessao, nota, comentario } = req.body;

  if (!comentario) {
    return res.status(400).json({ error: "Campo obrigatório em branco" });
  }

  if (!validarNota(nota) || !validarComentario(comentario)) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  const client_id = req.user.id;

  try {
    const novaAnalise = { data_sessao, nota, comentario, client_id };
    const analiseRegistro = await reviewService.postReview(novaAnalise);
    return res.status(201).json(analiseRegistro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getReviews(req, res) {
  try {
    const client_id = req.user.id;
    const reviews = await reviewService.getAll(client_id);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteReview(req, res) {
  const { id } = req.params;

  try {
    const removed = await reviewService.deleteReview(id);
    if (!removed) {
      return res.status(404).json({ error: "Análise não encontrado" });
    }
    return res.status(200).json({ message: "Análise removido com sucesso" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function updateReview(req, res) {
  const { id } = req.params;
  const { nota, comentario } = req.body;
  const client_id = req.user.id;

  try {
    const isOwner = await clientService.belongsToUser(id, client_id);
    if (!isOwner) {
      return res
        .status(404)
        .json({ error: "Cliente não encontrado ou não pertence ao usuario" });
    }
    const updatedReview = await reviewService.updateReview(id, {
      nota,
      comentario,
    });
    if (!updated) {
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
  deleteReview
}
