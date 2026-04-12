require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const User = require("../models/user.js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Só valida JWT Supabase e preenche req.user (rotas que não exigem checagem de role no Postgres).
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Erro de autenticação Supabase:", error.message);
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    const user = data.user;
    const rawId =
      user.user_metadata?.user_id ?? user.app_metadata?.user_id;
    const user_id_int =
      rawId !== undefined && rawId !== null ? Number(rawId) : NaN;

    if (Number.isNaN(user_id_int)) {
      console.error(
        "user_id inteiro não encontrado nos metadados do usuário (user_metadata / app_metadata)."
      );
      return res
        .status(500)
        .json({ error: "Configuração de usuário incompleta." });
    }

    req.user = {
      id: user_id_int,
      sub: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Erro geral no middleware de autenticação:", error.message);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

/**
 * Uma única função async: JWT + usuário local + role.
 * Evita encadear dois middlewares async (menos risco de estado inconsistente / ordem).
 */
function requireRoles(...allowedRoles) {
  return async function requireRolesMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        console.error("Erro de autenticação Supabase:", error.message);
        return res.status(403).json({ error: "Token inválido ou expirado." });
      }

      const supaUser = data.user;
      const rawId =
        supaUser.user_metadata?.user_id ?? supaUser.app_metadata?.user_id;
      const user_id_int =
        rawId !== undefined && rawId !== null ? Number(rawId) : NaN;

      if (Number.isNaN(user_id_int)) {
        console.error(
          "user_id não encontrado nos metadados após login (user_metadata / app_metadata)."
        );
        return res
          .status(500)
          .json({ error: "Configuração de usuário incompleta." });
      }

      const user = await User.findByPk(user_id_int, {
        attributes: ["role", "user_id", "nome", "email", "cpf"],
      });

      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado no banco de dados",
        });
      }

      const userRole = user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error:
            "Acesso negado, você não tem autorização para acessar essa função.",
          requiredRoles: allowedRoles,
          userRole: userRole,
          message: `Esta rota requer uma das seguintes funções: ${allowedRoles.join(", ")}`,
        });
      }

      req.user = {
        id: user_id_int,
        sub: supaUser.id,
        email: supaUser.email,
      };
      req.userRole = userRole;
      req.userData = user;

      next();
    } catch (err) {
      console.error("Erro no middleware requireRoles:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  };
}

const requireTatuador = requireRoles("tatuador", "admin");
const requireAdmin = requireRoles("admin");
const requireCliente = requireRoles("cliente", "admin");

module.exports = {
  authenticateToken,
  requireRoles,
  requireTatuador,
  requireAdmin,
  requireCliente,
};
