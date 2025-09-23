const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController.js');
const auth = require('../authentication/auth.js');
console.log(clientController)
router.get('/',auth.authenticateToken, clientController.getClients);          // GET todos ou por nome/telefone
router.get('/:id',auth.authenticateToken, clientController.getClientById);   // GET por ID
router.post('/',auth.authenticateToken, clientController.createClient);       // POST criar cliente
router.put('/:id',auth.authenticateToken, clientController.updateClient);    // PUT atualizar cliente
router.delete('/:id',auth.authenticateToken, clientController.deleteClient); // DELETE remover cliente

module.exports = router;
