const z = require('zod');
const phoneRegex = /^\d{9,11}$/;
const cpfRegex = /^(\d{11})$|^(\d{14})$/;
const userSchema = z.object({

  nome: z.string({
    required_error: "Nome é obrigatório",
    invalid_type_error: "Nome deve ser uma string",
  }).min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(30, { message: "Nome deve ter no máximo 30 caracteres" }),

  sobrenome: z.string({
    required_error: "Sobrenome é obrigatório",
    invalid_type_error: "Sobrenome deve ser uma string",
  }).min(3, { message: "Sobrenome deve ter no mínimo 3 caracteres" })
    .max(30, { message: "Sobrenome deve ter no máximo 30 caracteres" }),

  bio: z.string({
    invalid_type_error: "Bio deve ser uma string",
  }).max(480, { message: "Bio deve ter no máximo 480 caracteres" })
    .optional().or(z.literal('')),

  cpf: z.string({
    required_error: "CPF é obrigatório",
    invalid_type_error: "CPF deve ser uma string",
  }).regex(cpfRegex, { message: "CPF inválido. Deve ter 11 dígitos numéricos." }),

  endereco: z.string({
    invalid_type_error: "Endereço deve ser uma string",
  }).optional().or(z.literal('')),

  telefone: z.string({
    invalid_type_error: "Telefone deve ser uma string",
  }).regex(phoneRegex, { message: "Telefone inválido. Deve ter entre 9 e 11 dígitos numéricos e CNPJ deve ter 14 dígitos." })
    .optional().or(z.literal('')),

  whatsapp: z.string({
    invalid_type_error: "WhatsApp deve ser uma string",
  }).regex(phoneRegex, { message: "WhatsApp inválido. Deve ter entre 9 e 11 dígitos numéricos." })
    .optional().or(z.literal('')),

  instagram: z.string({
    invalid_type_error: "Instagram deve ser uma string",
  }).optional().or(z.literal('')),

  foto: z.string({
    invalid_type_error: "Foto deve ser uma string (caminho/URL)",
  }).optional(),

  email: z.string({
    required_error: "E-mail é obrigatório",
    invalid_type_error: "E-mail deve ser uma string",
  }).email({ message: "Formato de e-mail inválido" }),

  senha: z.string({
    required_error: "Senha é obrigatória",
    invalid_type_error: "Senha deve ser uma string",
  }).min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
    .max(100, { message: "Senha deve ter no máximo 100 caracteres" }),
});

const registerSchema = z.object({
  nome: z.string({
    required_error: "Nome é obrigatório",
    invalid_type_error: "Nome deve ser uma string",
  }).min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(30, { message: "Nome deve ter no máximo 30 caracteres" }),

  sobrenome: z.string({
    required_error: "Sobrenome é obrigatório",
    invalid_type_error: "Sobrenome deve ser uma string",
  }).min(3, { message: "Sobrenome deve ter no mínimo 3 caracteres" })
    .max(30, { message: "Sobrenome deve ter no máximo 30 caracteres" }),

  cpf: z.string({
    required_error: "CPF é obrigatório",
    invalid_type_error: "CPF deve ser uma string",
  }).regex(cpfRegex, { message: "CPF inválido. Deve ter 11 dígitos numéricos." }),

  email: z.string({
    required_error: "E-mail é obrigatório",
    invalid_type_error: "E-mail deve ser uma string",
  }).email({ message: "Formato de e-mail inválido" }),

  senha: z.string({
    required_error: "Senha é obrigatória",
    invalid_type_error: "Senha deve ser uma string",
  }).min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
    .max(100, { message: "Senha deve ter no máximo 100 caracteres" }),

  telefone: z.string({
    invalid_type_error: "Telefone deve ser uma string",
  }).regex(phoneRegex, { message: "Telefone inválido. Deve ter entre 9 e 11 dígitos numéricos." })
    .nullable().or(z.literal(''))
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  senha: z.string().min(1, { message: "Senha é obrigatória." }),
});

module.exports = {
  registerSchema,
  loginSchema,
};

const updateUserSchema = userSchema.partial();

const updatePerfilBodySchema = updateUserSchema.extend({
  especialidades: z.array(z.number().int()).optional(),
});

module.exports = {
  userSchema,
  updateUserSchema,
  updatePerfilBodySchema,
  registerSchema,
  loginSchema,
};
