const Favorito = require("../models/Favorito.js");
const User = require("../models/user.js");

const favoritadoInclude = {
  model: User,
  as: "favoritado",
  attributes: [
    "user_id",
    "nome",
    "sobrenome",
    "foto",
    "bio",
    "instagram",
    "role",
  ],
};

async function assertTatuadorTarget(tatuadorUserId) {
  const alvo = await User.findByPk(tatuadorUserId, {
    attributes: ["user_id", "role"],
  });
  if (!alvo) {
    const err = new Error("Tatuador não encontrado");
    err.statusCode = 404;
    throw err;
  }
  if (alvo.role !== "tatuador") {
    const err = new Error("Só é possível favoritar perfis de tatuador");
    err.statusCode = 400;
    throw err;
  }
  return alvo;
}

/**
 * @returns {{ favorito: boolean, ativo: boolean, favorito_id: number|null }}
 */
async function getStatus(clienteUserId, tatuadorUserId) {
  await assertTatuadorTarget(tatuadorUserId);

  const row = await Favorito.findOne({
    where: {
      cliente_id: clienteUserId,
      favoritado_id: tatuadorUserId,
    },
  });

  if (!row) {
    return { favorito: false, ativo: false, favorito_id: null };
  }

  return {
    favorito: row.ativo === true,
    ativo: row.ativo,
    favorito_id: row.favorito_id,
  };
}

/**
 * @returns {{ favorito: boolean, ativo: boolean, favorito_id: number }}
 */
async function toggle(clienteUserId, tatuadorUserId) {
  if (clienteUserId === tatuadorUserId) {
    const err = new Error("Não é possível favoritar a si mesmo");
    err.statusCode = 400;
    throw err;
  }

  await assertTatuadorTarget(tatuadorUserId);

  let row = await Favorito.findOne({
    where: {
      cliente_id: clienteUserId,
      favoritado_id: tatuadorUserId,
    },
  });

  if (!row) {
    row = await Favorito.create({
      cliente_id: clienteUserId,
      favoritado_id: tatuadorUserId,
      ativo: true,
    });
    return {
      favorito: true,
      ativo: true,
      favorito_id: row.favorito_id,
    };
  }

  row.ativo = !row.ativo;
  await row.save();

  return {
    favorito: row.ativo === true,
    ativo: row.ativo,
    favorito_id: row.favorito_id,
  };
}

async function listAtivos(clienteUserId) {
  return Favorito.findAll({
    where: {
      cliente_id: clienteUserId,
      ativo: true,
    },
    include: [favoritadoInclude],
    order: [["updatedAt", "DESC"]],
  });
}

module.exports = {
  getStatus,
  toggle,
  listAtivos,
};
