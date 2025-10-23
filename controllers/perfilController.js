const { createClient } = require('@supabase/supabase-js');
const { updatePerfilBodySchema } = require('../schemas/userSchema'); // Ajuste o caminho conforme a estrutura de pastas

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const perfilService = require('../services/perfilService');

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

  try {
    const validationResult = updatePerfilBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue =>
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ');
      return res.status(400).json({ message: `Dados de entrada inválidos: ${errorMessages}` });
    }

    const { especialidades, ...dataPerfil } = validationResult.data;

    if (req.file) {
      dataPerfil.foto = req.file.filename;
    }

    const perfil = await perfilService.updatePerfil(id, dataPerfil, especialidades || []);
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getPerfil,
  deletePerfil,
  updatePerfil
}
