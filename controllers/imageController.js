const s3 = require('../storage/s3.js');
const BUCKET_PUB_URL = process.env.PUBLIC_BUCKET_URL;
const userService = require('../services/userService.js');

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem enviada.');
  }

  const user = req.user;
  const userId = user.id;

  const path = `imagens/perfil/${Date.now()}-${userId}-${req.file.originalname}`;
  try {
    const user = await userService.getById(userId);
    const userImage = user.dataValues.foto;
    await s3.uploadFile(req.file, path);
    await userService.updateImage(userId, path);
    console.log(userImage);
    if (userImage) {
      await s3.deleteFile(userImage);
    }
    return res.status(200).json({ image: `${BUCKET_PUB_URL}/${path}` });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Erro ao enviar imagem.');
  }
};

module.exports = {
  uploadImage,
};
