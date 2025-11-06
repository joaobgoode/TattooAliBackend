const { createClient } = require('@supabase/supabase-js');
const { registerSchema, loginSchema } = require('../schemas/userSchema'); // Ajuste o caminho conforme a estrutura de pastas

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userService = require('../services/userService');
const authService = require('../services/authService');

async function register(req, res) {

  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    ).join('; ');
    return res.status(400).json({ error: `Dados de registro inválidos: ${errorMessages}` });
  }

  const { nome, sobrenome, cpf, email, senha, telefone } = validationResult.data;

  let supabaseUserId = null;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nome,
          sobrenome,
          cpf,
          telefone: telefone || null,
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    supabaseUserId = authData.user.id;

    const dataToCreate = {
      nome,
      sobrenome,
      cpf,
      email,
      // A senha salva no DB local será um hash feito pelo hook do Sequelize, não a string "Senha nao utilizada"
      // Aqui usamos "Senha não utilizada" apenas para satisfazer o campo NOT NULL do Sequelize
      // no momento da criação, já que a autenticação principal será pelo Supabase.
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
          nome,
          sobrenome,
          cpf,
          telefone: telefone || null,
        }
      }
    );

    if (updateError) {
      console.error("Erro ao atualizar metadados no Supabase Auth:", updateError.message);
      return res.status(500).json({ error: "Erro na finalização do registro. Tente novamente." });
    }

    return res.status(200).json({ message: "Usuário criado com sucesso, verifique seu e-mail para confirmar a conta" });
  } catch (error) {
    // Se a criação no banco local falhar, é crucial tentar reverter a criação no Supabase Auth
    if (supabaseUserId) {
      // Tenta deletar o usuário criado no Supabase Auth para evitar orfãos
      const { error: deleteError } = await supabase.auth.admin.deleteUser(supabaseUserId);
      if (deleteError) {
        console.error("Erro CRÍTICO ao tentar reverter o usuário no Supabase Auth:", deleteError.message);
      }
    }
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {

  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    ).join('; ');
    return res.status(400).json({ error: `Dados de login inválidos: ${errorMessages}` });
  }

  const { email, senha } = validationResult.data;

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

async function recoverPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório.' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectTo = `${frontendUrl}/reset-password`; 

    await authService.sendPasswordResetEmail(email, redirectTo);

    return res.status(200).json({ message: 'Se houver uma conta com esse e-mail, você receberá instruções para recuperar a senha.' });
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error.message || error);
    return res.status(500).json({ error: 'Erro ao processar solicitação de recuperação de senha.' });
  }
}

async function alterarSenha(req, res) {
  try {
    const { token, novaSenha } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Token de autenticação é obrigatório' });
    }

    if (!novaSenha) {
      return res.status(400).json({ error: 'Nova senha é obrigatória' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: novaSenha }
    );

    if (error) {
      console.error('Erro ao atualizar senha:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro interno no servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { register, login, recoverPassword, alterarSenha };
