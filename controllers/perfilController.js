const perfilService = require('../services/perfilService');

function validadeName(name) {
  if (typeof name !== 'string') {
    return false;
  }

  if (name.length < 3) {
    return false;
  }

  if (name.length > 30) {
    return false;
  }

  return true;
}

function validadeSurname(sobrenome) {
  if (typeof sobrenome !== 'string') {
    return false;
  }

  if (sobrenome.length < 3) {
    return false;
  }

  if (sobrenome.length > 30) {
    return false;
  }

  return true;
}

function validadeEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if (!regex.test(email)) {
    return false;
  }

  return true;
}

function validadeTelefone(telefone) {
  if (typeof telefone !== 'string') {
    return false;
  }

  if (telefone.length < 9) {
    return false;
  }

  if (telefone.length > 11) {
    return false;
  }

  const regex = /^\d+$/;
  if (!regex.test(telefone)) {
    return false;
  }

  return true;
}

function validadeBio(bio) {
  if (typeof bio !== 'string') {
    return false;
  }

  if (bio.length > 480) {
    return false;
  }

  return true;
}

function validadeCpf(cpf) {
  if (typeof cpf !== 'string') {
    return false;
  }

  const regex = /(^\d{11}$)|(^\d{14}$)/;
  if (!regex.test(cpf)) {
    return false;
  }

  return true;
}

function validadeEndereco(endereco) {
  if (typeof endereco !== 'string') {
    return false;
  }

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
  const { id } = req.user;

  try {
    const perfil = await perfilService.deletePerfilById(id);
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updatePerfil(req, res) {
  const { user_id, email, nome, sobrenome, bio, cpf, endereco, telefone, whatsapp, instagram, especialidades, foto } = req.body;
  const { id } = req.user;

  if (id !== user_id) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  if (!email) {
    return res.status(400).json({ message: 'Campo obrigatório não preenchido: email' });
  }

  if (!nome) {
    return res.status(400).json({ message: 'Campo obrigatório não preenchido: nome' });
  }

  if (!sobrenome) {
    return res.status(400).json({ message: 'Campo obrigatório não preenchido: sobrenome' });
  }

  if (!cpf) {
    return res.status(400).json({ message: 'Campo obrigatório não preenchido: cpf' });
  }

  if (email && !validadeEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  if (nome) {
    if (!validadeName(nome)) {
      return res.status(400).json({ message: 'Nome inválido' });
    }
  }

  if (sobrenome) {
    if (!validadeSurname(sobrenome)) {
      return res.status(400).json({ message: 'Sobrenome inválido' });
    }
  }

  if (bio) {
    if (!validadeBio(bio)) {
      return res.status(400).json({ message: 'Biografia inválida' });
    }
  }

  if (cpf) {
    if (!validadeCpf(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }
  }

  if (endereco) {
    if (!validadeEndereco(endereco)) {
      return res.status(400).json({ message: 'Endereço inválido' });
    }
  }

  if (telefone) {
    if (!validadeTelefone(telefone)) {
      return res.status(400).json({ message: 'Telefone inválido' });
    }
  }

  try {
    const perfil = await perfilService.updatePerfil(id, req.body, req.body.especialidades);
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getPerfil,
  deletePerfil,
  updatePerfil
};
