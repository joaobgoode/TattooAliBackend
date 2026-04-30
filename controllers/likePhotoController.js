const likePhotoService = require("../services/likePhotoService.js")

function parsePhotoId(req,res){
    const photoId = Number(req.params.id);
    if(!Number.isInteger(photoId) || photoId <= 0){
        res.status(400).json({ error: "ID de foto inválido" });
        return null;
    }
    return photoId;
}

async function likePhoto(req, res) {
  const photoId = parsePhotoId(req, res);
  if (!photoId) return;

  const userId = req.user.id;

  try {
    const data = await likePhotoService.likePhoto(photoId, userId);
    return res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function unlikePhoto(req, res) {
    const photoId = parsePhotoId(req, res);
    if(!photoId) return;

    const userId = req.user.id;

    try{
        const data = await likePhotoService.unlikePhoto(photoId, userId);
        return res.status(200).json(data);
    } catch(err){
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getLikeStatus(req, res) {
    const photoId = parsePhotoId(req, res);
    if (!photoId) return;

    const userId = req.user.id;

  try {
    const liked = await likePhotoService.hasLikedPhoto(photoId, userId);
    return res.status(200).json({ liked });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function getLikeCount(req, res) {
  const photoId = parsePhotoId(req, res);
  if (!photoId) return;

  try {
    const count = await likePhotoService.getPhotoLikesCount(photoId);
    return res.status(200).json({ count });
  } catch (err) {
    return formatError(err, res);
  }
}

module.exports = {
  likePhoto,
  unlikePhoto,
  getLikeStatus,
  getLikeCount,
};