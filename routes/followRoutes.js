const router = require("express").Router();
const auth = require("../authentication/auth.js");
const { requireCliente } = require("../authentication/requireCliente.js");
const followController = require("../controllers/followController.js");

router.get(
  "/feed",
  auth.authenticateToken,
  requireCliente,
  followController.getFeed
);

router.get(
  "/seguindo",
  auth.authenticateToken,
  requireCliente,
  followController.listSeguindo
);

router.get(
  "/seguidores",
  auth.requireTatuador,
  followController.listSeguidores
);

router.get(
  "/tatuador/:tatuadorId",
  auth.authenticateToken,
  requireCliente,
  followController.getStatus
);

router.post(
  "/",
  auth.authenticateToken,
  requireCliente,
  followController.follow
);

router.delete(
  "/tatuador/:tatuadorId",
  auth.authenticateToken,
  requireCliente,
  followController.unfollow
);

module.exports = router;
