const z = require('zod');
const phoneRegex = /^[0-9]+$/;
const createClientSchema = z.object({
  nome: z.string({
    required_error: "Nome é obrigatório",
    invalid_type_error: "Nome deve ser uma string",
  }).min(5, { message: "Nome deve ter no mínimo 5 caracteres" })
    .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),

  descricao: z.string({
    invalid_type_error: "Descrição deve ser uma string",
  }).max(480, { message: "Descrição deve ter no máximo 480 caracteres" })
    .optional(),

  telefone: z.string({
    invalid_type_error: "Telefone deve ser uma string",
  }).regex(phoneRegex, { message: "Telefone deve conter apenas números" })
    .optional(),

  endereco: z.string({
    invalid_type_error: "Endereço deve ser uma string",
  }).max(255, { message: "Endereço deve ter no máximo 255 caracteres" })
    .optional(),
});

const updateClientSchema = createClientSchema.partial();


module.exports = {
  createClientSchema,
  updateClientSchema
};