const { Op } = require("sequelize");
const Follow = require("../models/Follow.js");
const User = require("../models/user.js");
const Photo = require("../models/Photo.js");

const tatuadorInclude = {
  model: User,
  as: "tatuador",
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

const clienteInclude = {
  model: User,
  as: "cliente",
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
    const err = new Error("Só é possível seguir perfis de tatuador");
    err.statusCode = 400;
    throw err;
  }
  return alvo;
}

/**
 * @returns {{ seguindo: boolean, ativo: boolean, follow_id: number|null }}
 */
async function getStatus(clienteUserId, tatuadorUserId) {
  await assertTatuadorTarget(tatuadorUserId);

  const row = await Follow.findOne({
    where: {
      cliente_id: clienteUserId,
      tatuador_id: tatuadorUserId,
    },
  });

  if (!row) {
    return { seguindo: false, ativo: false, follow_id: null };
  }

  return {
    seguindo: row.ativo === true,
    ativo: row.ativo,
    follow_id: row.follow_id,
  };
}

/**
 * @returns {{ seguindo: boolean, ativo: boolean, follow_id: number }}
 */
async function follow(clienteUserId, tatuadorUserId) {
  if (clienteUserId === tatuadorUserId) {
    const err = new Error("Não é possível seguir a si mesmo");
    err.statusCode = 400;
    throw err;
  }

  await assertTatuadorTarget(tatuadorUserId);

  let row = await Follow.findOne({
    where: {
      cliente_id: clienteUserId,
      tatuador_id: tatuadorUserId,
    },
  });

  if (!row) {
    row = await Follow.create({
      cliente_id: clienteUserId,
      tatuador_id: tatuadorUserId,
      ativo: true,
    });
  } else if (!row.ativo) {
    row.ativo = true;
    await row.save();
  }

  return {
    seguindo: true,
    ativo: true,
    follow_id: row.follow_id,
  };
}

async function unfollow(clienteUserId, tatuadorUserId) {
  await assertTatuadorTarget(tatuadorUserId);

  const row = await Follow.findOne({
    where: {
      cliente_id: clienteUserId,
      tatuador_id: tatuadorUserId,
    },
  });

  if (!row || !row.ativo) {
    const err = new Error("Você não está seguindo este tatuador");
    err.statusCode = 404;
    throw err;
  }

  row.ativo = false;
  await row.save();

  return {
    seguindo: false,
    ativo: false,
    follow_id: row.follow_id,
  };
}

async function listSeguindo(clienteUserId) {
  return Follow.findAll({
    where: {
      cliente_id: clienteUserId,
      ativo: true,
    },
    include: [tatuadorInclude],
    order: [["updatedAt", "DESC"]],
  });
}

async function listSeguidores(tatuadorUserId) {
  return Follow.findAll({
    where: {
      tatuador_id: tatuadorUserId,
      ativo: true,
    },
    include: [clienteInclude],
    order: [["updatedAt", "DESC"]],
  });
}

async function getTatuadorIdsSeguidos(clienteUserId) {
  const rows = await Follow.findAll({
    where: { cliente_id: clienteUserId, ativo: true },
    attributes: ["tatuador_id"],
  });
  return rows.map((r) => r.tatuador_id);
}

/**
 * Fotos da galeria dos tatuadores seguidos (ativo), mais recentes primeiro, paginado.
 */
async function getFeed(clienteUserId, { page, limit }) {
  const ids = await getTatuadorIdsSeguidos(clienteUserId);
  if (!ids.length) {
    return {
      data: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }

  const where = { user_Id: { [Op.in]: ids } };

  const total = await Photo.count({ where });

  const offset = (page - 1) * limit;

  const rows = await Photo.findAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["user_id", "nome", "sobrenome", "foto", "instagram", "role"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    data: rows,
    page,
    limit,
    total,
    totalPages,
  };
}

module.exports = {
  getStatus,
  follow,
  unfollow,
  listSeguindo,
  listSeguidores,
  getFeed,
  getTatuadorIdsSeguidos,
};
