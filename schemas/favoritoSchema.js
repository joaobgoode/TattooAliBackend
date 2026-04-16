const z = require("zod");

const toggleFavoritoSchema = z.object({
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

module.exports = {
  toggleFavoritoSchema,
  tatuadorIdParamSchema,
};
