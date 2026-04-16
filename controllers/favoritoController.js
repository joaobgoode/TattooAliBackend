const favoritoService = require("../services/favoritoService.js");
const {
  toggleFavoritoSchema,
  tatuadorIdParamSchema,
} = require("../schemas/favoritoSchema.js");

function formatError(err, res) {
  const code = err.statusCode || 500;
  if (code >= 500) {
    console.error("favoritoController:", err);
  }
  return res.status(code).json({ error: err.message });
}

async function getStatus(req, res) {
  const parsed = tatuadorIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return res.status(400).json({ error: msg });
  }

  const tatuadorId = parsed.data.tatuadorId;
  const clienteId = req.user.id;

  try {
    const data = await favoritoService.getStatus(clienteId, tatuadorId);
    return res.status(200).json(data);
  } catch (err) {
    return formatError(err, res);
  }
}

async function toggle(req, res) {
  const parsed = toggleFavoritoSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return res.status(400).json({ error: msg });
  }

  const tatuadorId = parsed.data.tatuador_id;
  const clienteId = req.user.id;

  try {
    const data = await favoritoService.toggle(clienteId, tatuadorId);
    return res.status(200).json(data);
  } catch (err) {
    return formatError(err, res);
  }
}

async function list(req, res) {
  const clienteId = req.user.id;
  try {
    const rows = await favoritoService.listAtivos(clienteId);
    return res.status(200).json(rows);
  } catch (err) {
    return formatError(err, res);
  }
}

module.exports = {
  getStatus,
  toggle,
  list,
};
