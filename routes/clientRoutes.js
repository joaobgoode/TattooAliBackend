const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController.js');
const auth = require('../authentication/auth.js');
console.log(clientController)
/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do cliente
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           description: Nome do cliente (5-50 caracteres)
 *         telefone:
 *           type: string
 *           pattern: '^[0-9]+$'
 *           description: Telefone contendo apenas números
 *         descricao:
 *           type: string
 *           maxLength: 480
 *           description: Descrição opcional do cliente
 *         user_id:
 *           type: integer
 *           description: ID do usuário proprietário
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     ClientCreate:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           example: "João Silva"
 *         telefone:
 *           type: string
 *           pattern: '^[0-9]+$'
 *           example: "11999999999"
 *         descricao:
 *           type: string
 *           maxLength: 480
 *           example: "Cliente particular - sessões semanais"
 * 
 *     ClientUpdate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           example: "João Silva Santos"
 *         telefone:
 *           type: string
 *           pattern: '^[0-9]+$'
 *           example: "11988888888"
 *         descricao:
 *           type: string
 *           maxLength: 480
 *           example: "Cliente particular - sessões quinzenais"
 * 
 *   parameters:
 *     clientId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID do cliente
 *     nomeQuery:
 *       in: query
 *       name: nome
 *       schema:
 *         type: string
 *       description: Filtrar por nome do cliente
 *     telefoneQuery:
 *       in: query
 *       name: telefone
 *       schema:
 *         type: string
 *       description: Filtrar por telefone do cliente
 * 
 *   responses:
 *     ValidationError:
 *       description: Erro de validação nos campos
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 examples:
 *                   camposObrigatorios:
 *                     value: "Campos obrigatórios em branco"
 *                   camposInvalidos:
 *                     value: "Campos inválidos"
 *     NotFoundError:
 *       description: Cliente não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Cliente não encontrado"
 *     ForbiddenError:
 *       description: Acesso negado ao recurso
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Acesso negado"
 *     BadRequestError:
 *       description: Requisição inválida
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gerenciamento de clientes
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Lista todos os clientes do usuário ou filtra por nome/telefone
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/nomeQuery'
 *       - $ref: '#/components/parameters/telefoneQuery'
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get('/', auth.authenticateToken, clientController.getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtém um cliente específico por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientId'
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get('/:id', auth.authenticateToken, clientController.getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientCreate'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Erro de validação nos campos
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/ValidationError'
 *                 - $ref: '#/components/responses/BadRequestError'
 */
router.post('/', auth.authenticateToken, clientController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientUpdate'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', auth.authenticateToken, clientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientId'
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente removido com sucesso"
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.delete('/:id', auth.authenticateToken, clientController.deleteClient);

module.exports = router;
