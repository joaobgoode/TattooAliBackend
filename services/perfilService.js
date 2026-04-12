const User = require('../models/user');
const Style = require('../models/style');
const Bairro = require('../models/bairro');
const Client = require('../models/Client');
const sequelize = require('../db/database.js');
const { Op } = require('sequelize');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

function cpfSoDigitos(v) {
  return String(v ?? '').replace(/\D/g, '');
}

/** Espelha nome completo na ficha de agenda (Clients) com o mesmo CPF — visão web do tatuador. */
const PERFIL_UPDATE_KEYS = new Set([
  'nome',
  'sobrenome',
  'email',
  'telefone',
  'endereco',
  'bio',
  'whatsapp',
  'instagram',
  'bairro_id',
  'foto',
  'data_nascimento',
  'genero',
  'cidade',
  'uf',
  'estilo_favorito',
  'cpf',
]);

function pickPerfilPayload(dataPerfil) {
  return Object.fromEntries(
    Object.entries(dataPerfil).filter(
      ([k, v]) => PERFIL_UPDATE_KEYS.has(k) && v !== undefined,
    ),
  );
}

/**
 * Espelha na ficha da agenda (Clients, mesmo CPF) o que a pessoa editou no app/perfil.
 * Não depende de role: se existir linha em Clients com esse CPF (cliente na agenda de algum tatuador), atualiza.
 * Assim contas com role errado no Postgres ainda sincronizam com o painel web.
 */
async function syncClienteRowsFromClienteUser(userRow, transaction, perfilKeysTouched = []) {
  if (!userRow) return;
  const cpfNorm = cpfSoDigitos(userRow.cpf);
  if (cpfNorm.length !== 11) return;

  const rows = await Client.findAll({ where: { cpf: cpfNorm }, transaction });
  if (rows.length === 0) return;

  const fullName = [userRow.nome, userRow.sobrenome].filter(Boolean).join(' ').trim();
  if (!fullName) return;

  const uEnd = String(userRow.endereco || '').trim();
  const cidade = String(userRow.cidade || '').trim();
  const uf = String(userRow.uf || '').trim();
  const composedLoc = [cidade, uf].filter(Boolean).join(', ');
  const bioTrim = String(userRow.bio || '').trim();
  const bioTouched = perfilKeysTouched.includes('bio');
  const enderecoTouched = perfilKeysTouched.includes('endereco');

  for (const row of rows) {
    const patch = { nome: fullName };

    if (userRow.telefone != null) {
      if (String(userRow.telefone).trim() === '') {
        patch.telefone = '';
      } else {
        const t = cpfSoDigitos(userRow.telefone);
        if (t.length >= 9) patch.telefone = t;
      }
    }

    if (uEnd) {
      patch.endereco = uEnd.slice(0, 255);
    } else if (enderecoTouched) {
      patch.endereco = (composedLoc || '').slice(0, 255);
    } else if (composedLoc && !String(row.endereco || '').trim()) {
      patch.endereco = composedLoc.slice(0, 255);
    }

    if (bioTrim) {
      patch.descricao = bioTrim.slice(0, 255);
    } else if (bioTouched) {
      patch.descricao = '';
    }

    await row.update(patch, { transaction });
  }
}

async function getPerfilById(id) {
  const user = await User.findByPk(id, { include: [Style, Bairro] });
  return user;
}

async function deletePerfilById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Perfil não encontrado');
  }
  await user.destroy();
}

async function updatePerfil(id, dataPerfil, estilosIds) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Perfil não encontrado');
  }

  return await sequelize.transaction(async (t) => {
    const payload = pickPerfilPayload(dataPerfil);
    if (payload.cpf !== undefined) {
      const n = cpfSoDigitos(payload.cpf);
      if (!cpfValidator.isValid(n)) {
        throw new Error('CPF inválido.');
      }
      const dup = await User.findOne({
        where: { cpf: n, user_id: { [Op.ne]: id } },
        transaction: t,
      });
      if (dup) {
        throw new Error('Este CPF já está em uso em outra conta.');
      }
      payload.cpf = n;
    }

    const oldCpfNorm = cpfSoDigitos(user.cpf);
    const payloadKeys = Object.keys(payload);
    if (payloadKeys.length > 0) {
      await user.update(payload, { transaction: t });
    }

    if (Array.isArray(estilosIds) && estilosIds.length > 0) {
      await user.setStyles(estilosIds, { transaction: t });
    }

    await user.reload({ transaction: t });
    const newCpfNorm = cpfSoDigitos(user.cpf);
    if (
      payloadKeys.includes('cpf') &&
      oldCpfNorm.length === 11 &&
      newCpfNorm.length === 11 &&
      oldCpfNorm !== newCpfNorm
    ) {
      await Client.update(
        { cpf: newCpfNorm },
        { where: { cpf: oldCpfNorm }, transaction: t },
      );
    }

    await syncClienteRowsFromClienteUser(user, t, payloadKeys);

    return await User.findByPk(id, { include: [Style], transaction: t });
  });
}

async function updateImage(userId, imagePath) {
  const user = await User.findByPk(userId);
  return await user.update({ foto: imagePath });
}

module.exports = { getPerfilById, deletePerfilById, updatePerfil, updateImage };
