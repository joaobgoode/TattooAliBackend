const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/api/clients', clientController.getClients);          // GET todos ou por nome/telefone
router.get('/api/clients/:id', clientController.getClientById);   // GET por ID
router.post('/api/clients', clientController.createClient);       // POST criar cliente
router.put('/api/clients/:id', clientController.updateClient);    // PUT atualizar cliente
router.delete('/api/clients/:id', clientController.deleteClient); // DELETE remover cliente

module.exports = router;
