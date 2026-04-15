const router = require("express").Router();
const auth = require("../authentication/auth.js");
const { requireCliente } = require("../authentication/requireCliente.js");
const favoritoController = require("../controllers/favoritoController.js");

router.get(
  "/tatuador/:tatuadorId",
  auth.authenticateToken,
  requireCliente,
  favoritoController.getStatus
);

router.post(
  "/toggle",
  auth.authenticateToken,
  requireCliente,
  favoritoController.toggle
);

router.get(
  "/",
  auth.authenticateToken,
  requireCliente,
  favoritoController.list
);

module.exports = router;
