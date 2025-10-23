const z = require('zod');
const dataAtendimentoSchema = z.string().datetime({ message: "Formato de data e hora inválido. Esperado ISO 8601 (ex: '2025-10-25T10:00:00')." });
const createSessionSchema = z.object({
  cliente_id: z.number().int({ message: "ID do cliente deve ser um número inteiro." }),

  data_atendimento: dataAtendimentoSchema,

  valor_sessao: z.number().multipleOf(0.01).positive({ message: "Valor da sessão deve ser um número positivo (com até 2 casas decimais)." }),

  numero_sessao: z.number().int().positive({ message: "Número da sessão deve ser um inteiro positivo." }),

  descricao: z.string()
    .max(240, { message: "A descrição não pode exceder 240 caracteres." }) // Baseado na regra do controller
    .nullable()
    .optional(),

});

const updateSessionSchema = createSessionSchema.partial().extend({
  realizado: z.boolean().optional(),
  cancelado: z.boolean().optional(),

  motivo: z.string().max(255, { message: "O motivo deve ter no máximo 255 caracteres." })
    .nullable()
    .optional(),
});

const changeStatusSchema = z.object({
  realizado: z.boolean({ required_error: "O status 'realizado' é obrigatório e deve ser booleano." }),
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  changeStatusSchema,
};