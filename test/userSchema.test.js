const {
  userSchema,
  registerSchema,
  loginSchema,
  updateUserSchema,
  updatePerfilBodySchema,
} = require('../schemas/userSchema.js');

const mockValidUser = {
  nome: 'Ana',
  sobrenome: 'Souza',
  bio: 'Psicóloga clínica.',
  cpf: '12345678901',
  endereco: 'Rua das Flores, 100',
  telefone: '999999999',
  whatsapp: '99999999999',
  instagram: '@anapsico',
  foto: 'http://example.com/foto.jpg',
  email: 'ana.souza@email.com',
  senha: 'senhaSegura123',
};

const mockValidUserCNPJ = {
  ...mockValidUser,
  cpf: '12345678000199',
};

const getErrorMessage = (fn) => {
  try {
    fn();
  } catch (err) {
    if (err.issues && Array.isArray(err.issues)) {
      return err.issues[0]?.message;
    }
    return err.message;
  }
};

describe('User Schemas Validation', () => {
  describe('userSchema', () => {
    it('deve validar um objeto de usuário completo e válido (CPF com 11 dígitos)', () => {
      expect(() => userSchema.parse(mockValidUser)).not.toThrow();
    });

    it('deve validar um objeto de usuário com CNPJ válido (14 dígitos)', () => {
      expect(() => userSchema.parse(mockValidUserCNPJ)).not.toThrow();
    });

    it('deve validar quando campos opcionais são omitidos', () => {
      const { bio, endereco, telefone, whatsapp, instagram, foto, ...requiredFields } = mockValidUser;
      expect(() => userSchema.parse(requiredFields)).not.toThrow();
    });

    it('deve validar quando campos opcionais são strings vazias', () => {
      const userWithEmptyOptional = {
        ...mockValidUser,
        bio: '',
        endereco: '',
        telefone: '',
        whatsapp: '',
        instagram: '',
      };
      expect(() => userSchema.parse(userWithEmptyOptional)).not.toThrow();
    });

    describe('Falhas de Validação', () => {
      it('deve falhar se nome for muito curto', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, nome: 'An' })
        );
        expect(message).toBe('Nome deve ter no mínimo 3 caracteres');
      });

      it('deve falhar se sobrenome for muito longo', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, sobrenome: 'a'.repeat(31) })
        );
        expect(message).toBe('Sobrenome deve ter no máximo 30 caracteres');
      });

      it('deve falhar se bio exceder 480 caracteres', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, bio: 'a'.repeat(481) })
        );
        expect(message).toBe('Bio deve ter no máximo 480 caracteres');
      });

      it('deve falhar se CPF tiver formato inválido (ex: 10 dígitos)', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, cpf: '1234567890' })
        );
        expect(message).toBe('CPF inválido. Deve ter 11 dígitos numéricos.');
      });

      it('deve falhar se telefone tiver menos de 9 dígitos', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, telefone: '99999999' })
        );
        expect(message).toBe(
          'Telefone inválido. Deve ter entre 9 e 11 dígitos numéricos e CNPJ deve ter 14 dígitos.'
        );
      });

      it('deve falhar se whatsapp tiver mais de 11 dígitos', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, whatsapp: '999999999999' })
        );
        expect(message).toBe('WhatsApp inválido. Deve ter entre 9 e 11 dígitos numéricos.');
      });

      it('deve falhar se email for inválido', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, email: 'ana@invalido' })
        );
        expect(message).toBe('Formato de e-mail inválido');
      });

      it('deve falhar se senha for muito curta', () => {
        const message = getErrorMessage(() =>
          userSchema.parse({ ...mockValidUser, senha: 'short' })
        );
        expect(message).toBe('Senha deve ter no mínimo 8 caracteres');
      });
    });
  });

  describe('registerSchema', () => {
    const mockValidRegister = {
      nome: mockValidUser.nome,
      sobrenome: mockValidUser.sobrenome,
      cpf: mockValidUser.cpf,
      email: mockValidUser.email,
      senha: mockValidUser.senha,
      telefone: mockValidUser.telefone,
    };

    it('deve validar um objeto de registro válido com telefone', () => {
      expect(() => registerSchema.parse(mockValidRegister)).not.toThrow();
    });

    it('deve validar um objeto de registro válido sem telefone (opcional)', () => {
      const { telefone, ...required } = mockValidRegister;
      expect(() => registerSchema.parse(required)).not.toThrow();
    });

    it('deve falhar se um campo obrigatório for omitido (ex: email)', () => {
      const { email, ...invalidRegister } = mockValidRegister;
      const message = getErrorMessage(() =>
        registerSchema.parse(invalidRegister)
      );
      expect(message).toContain('expected string');
    });

    it('deve falhar se telefone for inválido', () => {
      const message = getErrorMessage(() =>
        registerSchema.parse({ ...mockValidRegister, telefone: '1234' })
      );
      expect(message).toBe('Telefone inválido. Deve ter entre 9 e 11 dígitos numéricos.');
    });
  });

  describe('loginSchema', () => {
    it('deve validar um objeto de login válido', () => {
      expect(() => loginSchema.parse({ email: 'test@email.com', senha: '123' })).not.toThrow();
    });

    it('deve falhar se email for inválido', () => {
      const message = getErrorMessage(() =>
        loginSchema.parse({ email: 'test@invalido', senha: '123' })
      );
      expect(message).toBe('E-mail inválido.');
    });

    it('deve falhar se senha for vazia', () => {
      const message = getErrorMessage(() =>
        loginSchema.parse({ email: 'test@email.com', senha: '' })
      );
      expect(message).toBe('Senha é obrigatória.');
    });
  });

  describe('updateUserSchema', () => {
    it('deve validar a atualização com apenas um campo (nome)', () => {
      expect(() => updateUserSchema.parse({ nome: 'Novo Nome' })).not.toThrow();
    });

    it('deve validar a atualização de todos os campos (parcial)', () => {
      expect(() => updateUserSchema.parse(mockValidUser)).not.toThrow();
    });

    it('deve validar a remoção (null) de campos opcionais que são strings', () => {
      expect(() => updateUserSchema.parse({ bio: null, endereco: null })).not.toThrow();
    });

    it('deve falhar se um campo for fornecido com formato inválido (ex: senha muito curta)', () => {
      const message = getErrorMessage(() =>
        updateUserSchema.parse({ senha: 'abc' })
      );
      expect(message).toBe('Senha deve ter no mínimo 8 caracteres');
    });

    it('deve falhar se um campo for fornecido com tipo inválido (ex: nome como número)', () => {
      const message = getErrorMessage(() =>
        updateUserSchema.parse({ nome: 123 })
      );
      expect(message).toContain('expected string');
    });
  });

  describe('updatePerfilBodySchema', () => {
    it('deve validar uma atualização de perfil que inclui especialidades', () => {
      const mockUpdate = {
        nome: 'Novo Nome',
        email: 'novo@email.com',
        especialidades: [1, 5, 10],
      };
      expect(() => updatePerfilBodySchema.parse(mockUpdate)).not.toThrow();
    });

    it('deve validar uma atualização de perfil sem o array de especialidades', () => {
      expect(() => updatePerfilBodySchema.parse({ nome: 'Novo Nome' })).not.toThrow();
    });

    it('deve falhar se especialidades não for um array de números inteiros', () => {
      const message = getErrorMessage(() =>
        updatePerfilBodySchema.parse({ especialidades: [1, '2', 3] })
      );
      expect(message).toContain('expected number');
    });

    it('deve falhar se especialidades for um array com floats', () => {
      const message = getErrorMessage(() =>
        updatePerfilBodySchema.parse({ especialidades: [1, 2.5] })
      );
      expect(message).toContain('expected int');
    });
  });
});
