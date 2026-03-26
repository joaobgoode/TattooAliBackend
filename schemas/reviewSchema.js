const z = require("zod");

const createReviewSchema = z.object({
  review_id: z
    .number()
    .int({ message: "ID da analise deve ser um número inteiro." }),

  nota_cliente: z
    .number()
    .int({ message: "A nota deve ser um número inteiro" })
    .min(1, { message: "A nota deve ser no mínimo 1." })
    .max(5, { message: "A nota deve ser no máximo 5." }),

  comentario: z
    .string({ message: "A análise deve ter um comentário" })
    .max(500, { message: "A descrição não pode exceder 500 caracteres." }),
});

module.exports = {
  createReviewSchema,
};
