const express = require('express');
const auth = require('../authentication/auth.js');
const perfilController = require('../controllers/perfilController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Perfil:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         user_id:
 *           type: integer
 *           description: ID do usuário (mesmo que id)
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Nome do usuário
 *         sobrenome:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Sobrenome do usuário
 *         bio:
 *           type: string
 *           maxLength: 480
 *           description: Biografia do usuário
 *         cpf:
 *           type: string
 *           pattern: '^\d{11}$|^\d{14}$'
 *           description: CPF do usuário (11 ou 14 dígitos)
 *         endereco:
 *           type: string
 *           description: Endereço do usuário
 *         telefone:
 *           type: string
 *           minLength: 9
 *           maxLength: 11
 *           pattern: '^\d+$'
 *           description: Telefone do usuário (apenas números)
 *         whatsapp:
 *           type: string
 *           description: WhatsApp do usuário
 *         instagram:
 *           type: string
 *           description: Instagram do usuário
 *         especialidades:
 *           type: string
 *           description: Especialidades do profissional
 *         foto:
 *           type: string
 *           description: URL ou path da foto do perfil
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     PerfilUpdate:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: ID do usuário (deve corresponder ao token)
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@exemplo.com"
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           example: "João"
 *         sobrenome:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           example: "Silva"
 *         bio:
 *           type: string
 *           maxLength: 480
 *           example: "Psicólogo com 10 anos de experiência em terapia cognitivo-comportamental"
 *         cpf:
 *           type: string
 *           pattern: '^\d{11}$|^\d{14}$'
 *           example: "12345678901"
 *         endereco:
 *           type: string
 *           example: "Rua Exemplo, 123 - Centro - São Paulo/SP"
 *         telefone:
 *           type: string
 *           minLength: 9
 *           maxLength: 11
 *           pattern: '^\d+$'
 *           example: "11999999999"
 *         whatsapp:
 *           type: string
 *           example: "11988888888"
 *         instagram:
 *           type: string
 *           example: "@joaopsicologo"
 *         especialidades:
 *           type: string
 *           example: "Terapia Cognitivo-Comportamental, Ansiedade, Depressão"
 *         foto:
 *           type: string
 *           example: "uploads/foto-perfil.jpg"
 *         Styles:
 *           type: object
 *           description: Estilos associados ao perfil (estrutura variável)
 * 
 *   responses:
 *     UnauthorizedError:
 *       description: Não autorizado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Não autorizado"
 *     ValidationError:
 *       description: Erro de validação nos campos
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 examples:
 *                   emailInvalido:
 *                     value: "Email inválido"
 *                   nomeInvalido:
 *                     value: "Nome inválido"
 *                   sobrenomeInvalido:
 *                     value: "Sobrenome inválido"
 *                   bioInvalida:
 *                     value: "Biografia inválida"
 *                   cpfInvalido:
 *                     value: "CPF inválido"
 *                   enderecoInvalido:
 *                     value: "Endereço inválido"
 *                   telefoneInvalido:
 *                     value: "Telefone inválido"
 *     BadRequestError:
 *       description: Erro na requisição
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
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
 *   name: Perfil
 *   description: Gerenciamento do perfil do usuário
 */

/**
 * @swagger
 * /perfil:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perfil'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get('/', auth.authenticateToken, perfilController.getPerfil);

/**
 * @swagger
 * /perfil:
 *   delete:
 *     summary: Exclui o perfil do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perfil'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.delete('/', auth.authenticateToken, perfilController.deletePerfil);

/**
 * @swagger
 * /perfil:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilUpdate'
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perfil'
 *       400:
 *         description: Erro de validação nos campos
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/ValidationError'
 *                 - $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/', auth.authenticateToken, perfilController.updatePerfil);

module.exports = router;
