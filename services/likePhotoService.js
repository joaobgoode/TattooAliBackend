const LikePhoto = require("../models/LikePhoto.js")
const Photo = require("../models/Photo.js");
const User = require("../models/user.js")


async function assertPhotoExists(photoId){
    const photo = await Photo.findByPk(photoId, { attributes: ["photo_id"]});
    if(!photo){
        const error = new Error("Foto não encontrada");
        error.statusCode = 404;
        throw error;
    }
    return photo;
}

async function assertUserExists(userId) {
  const user = await User.findByPk(userId, { attributes: ["user_id"] });
  if (!user) {
    const err = new Error("Usuário não encontrado");
    err.statusCode = 404;
    throw err;
  }
  return user;
}

async function hasLikedPhoto(photoId, userId) {
    const like = await LikePhoto.findOne({
        where: {
            photo_id: photoId,
            user_id: userId
        },
    });
    return !!like
}

async function likePhoto(photoId, userId) {
    await assertUserExists(userId);
    await assertPhotoExists(photoId);

    const [like, created] = await LikePhoto.findOrCreate({
        where: {
            photo_id: photoId,
            user_id: userId,
        }
    });

    return{
        liked: true,
        created,
        like_id: like.like_id
    };
}

async function unlikePhoto(photoId, userId) {
  const like = await LikePhoto.findOne({
    where: {
      photo_id: photoId,
      user_id: userId,
    },
  });

  if (!like) {
    return { removed: false };
  }

  await like.destroy();
  return { removed: true };
}

async function getPhotoLikesCount(photoId) {
  await assertPhotoExists(photoId);
  return await LikePhoto.count({
    where: { photo_id: photoId },
  });
}

module.exports = {
  hasLikedPhoto,
  likePhoto,
  unlikePhoto,
  getPhotoLikesCount,
};