const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const User = require("../models/user.js");

function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      // Verifica se o usuário está na requisição
      if (!req.user || req.user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      // Busca o usuário no banco de dados local para obter a role
      const user = await User.findByPk(req.user.id, {
        attributes: ["role", "user_id", "nome", "email", "cpf"],
      });

      if (!user) {
        return res
          .status(404)
          .json({ error: "Usuário não encontrado no banco de dados" });
      }

      // Adiciona a role e informações do usuário à requisição
      req.userRole = user.role;
      req.userData = user;

      // Verifica se a role do usuário está entre as permitidas
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: "Acesso negado, você não tem autorização para acessar essa função.",
          requiredRoles: allowedRoles,
          userRole: userRole,
          message: `Esta rota requer uma das seguintes funções: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Erro no middleware de autorização:", error);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao verificar permissões" });
    }
  };
}

function isTatuador(req, res, next) {
  return authorizeRole("tatuador", "admin")(req, res, next);
}

function isAdmin(req, res, next) {
  return authorizeRole("admin")(req, res, next);
}

function isCliente(req, res, next) {
  return authorizeRole("cliente", "admin")(req, res, next);
}


module.exports = {
  authorizeRole,
  isTatuador,
  isAdmin,
  isCliente
};