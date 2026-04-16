/**
 * Compatibilidade com imports antigos; a lógica vive em auth.js.
 */
const auth = require("./auth.js");

module.exports = {
  authorizeRole: auth.requireRoles,
  isTatuador: auth.requireTatuador,
  isAdmin: auth.requireAdmin,
  isCliente: auth.requireCliente,
};
