const jwt = require("jsonwebtoken");
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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

    const user_id_int = user.user_metadata.user_id;

    if (!user_id_int) {
      console.error("user_id inteiro não encontrado nos metadados do usuário.");
      return res.status(500).json({ error: "Configuração de usuário incompleta." });
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

module.exports = { authenticateToken };