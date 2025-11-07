// services/photoService.js

const Photo = require('../models/Photo.js');

/**
 * Cria uma nova foto no banco de dados, associada a um usuário.
 * @param {object} photoData - Dados da foto. Ex: { url: 'nome-do-arquivo.jpg', usuario_id: 1, titulo: 'Opcional' }
 * @returns {Promise<Photo>} A instância da foto criada.
 */
async function createPhoto(photoData) {
  // Garante que os dados essenciais (url e usuario_id) foram passados
  if (!photoData.url || !photoData.user_Id) {
    throw new Error('URL da foto e ID do usuário são obrigatórios.');
  }
  return await Photo.create(photoData);
}

/**
 * Busca todas as fotos de um usuário específico.
 * @param {number} userId - O ID do usuário.
 * @returns {Promise<Photo[]>} Um array com as fotos encontradas.
 */
async function getPhotosByUserId(userId) {
  return await Photo.findAll({
    where: {
      user_Id: userId
    },
    order: [['createdAt', 'DESC']] // Opcional: ordena as fotos da mais nova para a mais antiga
  });
}

/**
 * Busca uma única foto pela sua chave primária (ID).
 * @param {number} id - O ID da foto.
 * @returns {Promise<Photo|null>} A instância da foto ou null se não for encontrada.
 */
async function getPhotoById(id) {
  return await Photo.findByPk(id);
}

/**
 * Deleta uma foto do banco de dados.
 * @param {number} id - O ID da foto a ser deletada.
 * @returns {Promise<number>} O número de registros deletados (0 ou 1).
 */
async function deletePhoto(id) {
  const photo = await Photo.findByPk(id);
  if (!photo) {
    return false; // Retorna 0 se a foto não existe
  }
  await photo.destroy();
  return true;
}

module.exports = {
  createPhoto,
  getPhotosByUserId,
  getPhotoById,
  deletePhoto
};