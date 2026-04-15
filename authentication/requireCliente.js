const User = require("../models/user.js");

/**
 * Após authenticateToken: só usuários com role "cliente" podem prosseguir.
 */
async function requireCliente(req, res, next) {
  try {
    if (!req.user || req.user.id == null) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["user_id", "role"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.role !== "cliente") {
      return res.status(403).json({
        error: "Apenas usuários com perfil de cliente podem usar este recurso.",
      });
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    console.error("requireCliente:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { requireCliente };
