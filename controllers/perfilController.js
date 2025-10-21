const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const perfilService = require('../services/perfilService');

function validadeName(name) {
  if (typeof name !== 'string' || name.length < 3 || name.length > 30) return false;
  return true;
}
function validadeSurname(sobrenome) {
  if (typeof sobrenome !== 'string' || sobrenome.length < 3 || sobrenome.length > 30) return false;
  return true;
}
function validadeEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(email)) return false;
  return true;
}
function validadeTelefone(telefone) {
  if (typeof telefone !== 'string' || telefone.length < 9 || telefone.length > 11) return false;
  const regex = /^\d+$/;
  if (!regex.test(telefone)) return false;
  return true;
}
function validadeBio(bio) {
  if (typeof bio !== 'string' || bio.length > 480) return false;
  return true;
}
function validadeCpf(cpf) {
  if (typeof cpf !== 'string') return false;
  const regex = /(^\d{11}$)|(^\d{14}$)/;
  if (!regex.test(cpf)) return false;
  return true;
}
function validadeEndereco(endereco) {
  if (typeof endereco !== 'string') return false;
  return true;
}

async function getPerfil(req, res) {
  const { id } = req.user;
  try {
    const perfil = await perfilService.getPerfilById(id);
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function deletePerfil(req, res) {
  const { id: user_id, sub: supabase_id } = req.user;
  try {
    const perfil = await perfilService.deletePerfilById(user_id);

    if (!supabase_id) {
      return res.status(500).json({ message: "ID do Supabase não encontrado no token" });
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(supabase_id);
    if (authError) {
      throw new Error(`Erro ao deletar usuário no Supabase Auth: ${authError.message}`);
    }

    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updatePerfil(req, res) {
  const { id } = req.user;

  const { especialidades, ...dataPerfil } = req.body;

  if (req.file) {
    console.log("Arquivo de imagem recebido:", req.file);
  }

  if (dataPerfil.nome && !validadeName(dataPerfil.nome)) {
    return res.status(400).json({ message: 'Nome inválido' });
  }
  if (dataPerfil.sobrenome && !validadeSurname(dataPerfil.sobrenome)) {
    return res.status(400).json({ message: 'Sobrenome inválido' });
  }
  if (dataPerfil.bio && !validadeBio(dataPerfil.bio)) {
    return res.status(400).json({ message: 'Biografia inválida' });
  }

  try {
    const perfil = await perfilService.updatePerfil(id, dataPerfil, especialidades || []);
    return res.status(200).json(perfil);
  } catch (error) {
    console.error("Erro no controller ao atualizar perfil:", error);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getPerfil,
  deletePerfil,
  updatePerfil
}