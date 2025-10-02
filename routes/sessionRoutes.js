const express = require('express');
const auth = require('../authentication/auth.js');
const sessionController = require('../controllers/sessionController');

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - cliente_id
 *         - data_atendimento
 *         - valor_sessao
 *         - numero_sessao
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da sessão
 *         cliente_id:
 *           type: integer
 *           description: ID do cliente
 *         usuario_id:
 *           type: integer
 *           description: ID do usuário (psicólogo)
 *         data_atendimento:
 *           type: string
 *           format: date-time
 *           description: Data e hora do atendimento
 *         valor_sessao:
 *           type: number
 *           format: float
 *           description: Valor da sessão
 *         numero_sessao:
 *           type: integer
 *           description: Número sequencial da sessão
 *         descricao:
 *           type: string
 *           maxLength: 240
 *           description: Descrição da sessão
 *         realizado:
 *           type: boolean
 *           description: Status se a sessão foi realizada
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     SessionCreate:
 *       type: object
 *       required:
 *         - cliente_id
 *         - data_atendimento
 *         - valor_sessao
 *         - numero_sessao
 *       properties:
 *         cliente_id:
 *           type: integer
 *         data_atendimento:
 *           type: string
 *           format: date-time
 *         valor_sessao:
 *           type: number
 *           format: float
 *         numero_sessao:
 *           type: integer
 *         descricao:
 *           type: string
 *           maxLength: 240
 * 
 *     SessionUpdate:
 *       type: object
 *       properties:
 *         cliente_id:
 *           type: integer
 *         data_atendimento:
 *           type: string
 *           format: date-time
 *         valor_sessao:
 *           type: number
 *           format: float
 *         numero_sessao:
 *           type: integer
 *         descricao:
 *           type: string
 *           maxLength: 240
 * 
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - realizado
 *       properties:
 *         realizado:
 *           type: boolean
 *           description: Novo status da sessão
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   parameters:
 *     sessionId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID da sessão
 *     clienteQuery:
 *       in: query
 *       name: cliente
 *       schema:
 *         type: integer
 *       description: Filtrar por ID do cliente
 *     dataQuery:
 *       in: query
 *       name: data
 *       schema:
 *         type: string
 *         format: date
 *       description: Filtrar por data (YYYY-MM-DD)
 * 
 *   responses:
 *     ValidationError:
 *       description: Erro de validação
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *     NotFoundError:
 *       description: Sessão não encontrada
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Sessão não encontrada.
 *     ServerError:
 *       description: Erro interno do servidor
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Gerenciamento de sessões de terapia
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Lista todas as sessões do usuário
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/clienteQuery'
 *       - $ref: '#/components/parameters/dataQuery'
 *     responses:
 *       200:
 *         description: Lista de sessões retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', auth.authenticateToken, sessionController.getAll);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Obtém uma sessão específica por ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     responses:
 *       200:
 *         description: Sessão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', auth.authenticateToken, sessionController.getById);

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Cria uma nova sessão
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionCreate'
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Erro de validação ou campos obrigatórios em branco
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/ValidationError'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Campos obrigatórios em branco!
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', auth.authenticateToken, sessionController.createSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Atualiza uma sessão existente
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionUpdate'
 *     responses:
 *       200:
 *         description: Sessão atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Erro ao atualizar sessão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar sessão.
 */
router.put('/:id', auth.authenticateToken, sessionController.updateSession);

/**
 * @swagger
 * /api/sessions/realizar/{id}:
 *   put:
 *     summary: Altera o status de realização de uma sessão
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Status da sessão alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Resposta inválida para o status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: resposta invalida
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/realizar/:id', auth.authenticateToken, sessionController.changeStatus);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Exclui uma sessão
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     responses:
 *       204:
 *         description: Sessão excluída com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', auth.authenticateToken, sessionController.deleteSession);

router.get('/pendentes', auth.authenticateToken, sessionController.getPendingSessions);
router.get('/realizadas', auth.authenticateToken, sessionController.getRealizedSessions);
router.get('/canceladas', auth.authenticateToken, sessionController.getCanceledSessions);
router.get('/cliente/:clienteId/pendentes', auth.authenticateToken, sessionController.getClientPendingSessions);
router.get('/cliente/:clienteId/realizadas', auth.authenticateToken, sessionController.getClientRealizedSessions);
router.get('/cliente/:clienteId/canceladas', auth.authenticateToken, sessionController.getClientCanceledSessions);

module.exports = router;



