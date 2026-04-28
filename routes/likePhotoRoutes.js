const router = require("express").Router();
const auth = require("../authentication/auth.js");
const likePhotoController = require("../controllers/likePhotoController.js")


router.post("/:id/like", auth.authenticateToken, likePhotoController.likePhoto);
router.delete("/:id/like", auth.authenticateToken, likePhotoController.unlikePhoto);
router.get("/:id/like", auth.authenticateToken, likePhotoController.getLikeStatus);
router.get("/:id/likes", likePhotoController.getLikeCount);

module.exports = router;