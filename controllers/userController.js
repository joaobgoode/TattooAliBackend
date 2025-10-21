const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userService = require('../services/userService');

async function register(req, res) {
  const {
    nome, sobrenome, cpf, email, senha, telefone
  } = req.body;
  if (!nome || !sobrenome || !cpf || !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios em branco" });
  }
  let supabaseUserId = null;
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nome: nome,
          sobrenome: sobrenome,
          cpf: cpf,
          telefone: telefone,
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    supabaseUserId = authData.user.id;

    const dataToCreate = {
      nome: nome,
      sobrenome: sobrenome,
      cpf: cpf,
      email: email,
      senha: "Senha nao utilizada",
    };
    if (telefone) {
      dataToCreate.telefone = telefone;
    }
    const createdUser = await userService.create(dataToCreate);
    const user_id_int = createdUser.user_id;

    if (!user_id_int) {
      throw new Error("Falha ao obter user_id inteiro após a criação no DB.");
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      supabaseUserId,
      {
        user_metadata: {
          user_id: user_id_int,
          nome: nome,
          sobrenome: sobrenome,
          cpf: cpf,
          telefone: telefone,
        }
      }
    );

    if (updateError) {
      console.error("Erro ao atualizar metadados no Supabase Auth:", updateError.message);
      return res.status(500).json({ error: "Erro na finalização do registro. Tente novamente." });
    }

    return res.status(200).json({ message: "Usuário criado com sucesso, verifique seu e-mail para confirmar a conta" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const {
    email, senha
  } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios em branco" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ token: data.session.access_token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login };