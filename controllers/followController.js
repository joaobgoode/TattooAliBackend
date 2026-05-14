const followService = require("../services/followService.js");
const {
  followTatuadorBodySchema,
  tatuadorIdParamSchema,
  feedQuerySchema,
} = require("../schemas/followSchema.js");

function formatError(err, res) {
  const code = err.statusCode || 500;
  if (code >= 500) {
    console.error("followController:", err);
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
    const data = await followService.getStatus(clienteId, tatuadorId);
    return res.status(200).json(data);
  } catch (err) {
    return formatError(err, res);
  }
}

async function follow(req, res) {
  const parsed = followTatuadorBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return res.status(400).json({ error: msg });
  }

  const tatuadorId = parsed.data.tatuador_id;
  const clienteId = req.user.id;

  try {
    const data = await followService.follow(clienteId, tatuadorId);
    return res.status(200).json(data);
  } catch (err) {
    return formatError(err, res);
  }
}

async function unfollow(req, res) {
  const parsed = tatuadorIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return res.status(400).json({ error: msg });
  }

  const tatuadorId = parsed.data.tatuadorId;
  const clienteId = req.user.id;

  try {
    const data = await followService.unfollow(clienteId, tatuadorId);
    return res.status(200).json(data);
  } catch (err) {
    return formatError(err, res);
  }
}

async function listSeguindo(req, res) {
  const clienteId = req.user.id;
  try {
    const rows = await followService.listSeguindo(clienteId);
    return res.status(200).json(rows);
  } catch (err) {
    return formatError(err, res);
  }
}

async function listSeguidores(req, res) {
  const tatuadorId = req.user.id;
  try {
    const rows = await followService.listSeguidores(tatuadorId);
    return res.status(200).json(rows);
  } catch (err) {
    return formatError(err, res);
  }
}

async function getFeed(req, res) {
  const parsed = feedQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return res.status(400).json({ error: msg });
  }

  const { page, limit } = parsed.data;
  const clienteId = req.user.id;

  try {
    const payload = await followService.getFeed(clienteId, { page, limit });
    return res.status(200).json(payload);
  } catch (err) {
    return formatError(err, res);
  }
}

module.exports = {
  getStatus,
  follow,
  unfollow,
  listSeguindo,
  listSeguidores,
  getFeed,
};
