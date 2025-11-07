const photoService = require("../services/photoService")
const { uploadFile, deleteFile } = require("../storage/s3")
const BUCKET_PUB_URL = process.env.PUBLIC_BUCKET_URL;

async function uploadPhoto(req, res) {
    try {
        const image = req.file
        
        if (!image){
            return res.status(304).json({mensagem: "Favor enviar uma imagem"})
        }

        const dados = req.body ?? {};

        const id = req.user.id

        const fileName = `${Date.now()}-${id}-${req.file.originalname}`;
        const filePath = `galeria/${fileName}`;
        const fullpath = BUCKET_PUB_URL + "/" + filePath;

        await uploadFile(image, filePath)

        const imageBody = {
            user_Id: id,
            url: filePath,
            ...dados
        }

        const newImage = await photoService.createPhoto(imageBody)

        if (newImage) {
            return res.status(201).json(newImage)
        }

        return res.status(500).json({message: "Erro do servidor"})
    } catch (error) {
      console.error('Erro ao criar imagem:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getPhotos(req, res) {
  try {
    const id = req.params.id
    const photos = await photoService.getPhotosByUserId(id);
    return res.status(200).json(photos);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getPhotoById(req, res) {
  const { id } = req.params;

  try {
    
    const photo = await photoService.getPhotoById(id);
    if (!photo) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }
    return res.status(200).json(photo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deletePhoto(req, res) {
    const id = req.params.id
    const user_id = req.user.id;
    try {

        const photo = await photoService.getPhotoById(id)

        if (!photo){
            return res.status(404).json({mensagem: "Imagem não encontrada"})
        }

        const image_user_id = photo.user_Id

        if (image_user_id != user_id){
            return res.status(403).json({mensagem: "Sem permissão para deletar a imagem"})
        }

        const url = photo.url.slice(BUCKET_PUB_URL.length + 1)

        const ok = await photoService.deletePhoto(id)

        if (!ok) {
            return res.status(404).json({mensagem: "Imagem não encontrada"})
        }

        await deleteFile(url)

        return res.status(200).json({mensagem: "Imagem deletada"})


    } catch (error) {
      console.error('Erro ao detelar imagem:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getUserPhotos(req, res) {
  try {
    const id = req.user.id
    const photos = await photoService.getPhotosByUserId(id);
    return res.status(200).json(photos);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
    deletePhoto,
    uploadPhoto,
    getPhotoById,
    getPhotos,
    getUserPhotos
}
