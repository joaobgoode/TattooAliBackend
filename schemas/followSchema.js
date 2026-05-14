const z = require("zod");

const followTatuadorBodySchema = z.object({
  tatuador_id: z
    .number({ message: "tatuador_id deve ser um número" })
    .int({ message: "tatuador_id deve ser um inteiro" })
    .positive({ message: "tatuador_id deve ser positivo" }),
});

const tatuadorIdParamSchema = z.object({
  tatuadorId: z.coerce
    .number({ message: "tatuadorId deve ser um número" })
    .int()
    .positive(),
});

const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .default(20),
});

module.exports = {
  followTatuadorBodySchema,
  tatuadorIdParamSchema,
  feedQuerySchema,
};
