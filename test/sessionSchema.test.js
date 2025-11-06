const {
  createSessionSchema,
  updateSessionSchema,
  changeStatusSchema,
} = require('../schemas/sessionSchema')

describe('Session Schemas Validation', () => {

  const mockValidSession = {
    cliente_id: 123,
    data_atendimento: '2025-10-20T10:30:00',
    valor_sessao: 150.50,
    numero_sessao: 5,
    descricao: 'Sessão de terapia cognitivo-comportamental.',
  };

  const mockValidUpdate = {
    valor_sessao: 160.00,
    descricao: null,
    realizado: true,
    cancelado: false,
    motivo: 'Mudança de preço.',
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

  describe('createSessionSchema', () => {
    it('deve validar um objeto de sessão completo e válido', () => {
      expect(() => createSessionSchema.parse(mockValidSession)).not.toThrow();
    });

    it('deve validar um objeto de sessão com a descrição opcional omitida', () => {
      const { descricao, ...sessionWithoutDesc } = mockValidSession;
      expect(() => createSessionSchema.parse(sessionWithoutDesc)).not.toThrow();
    });

    it('deve validar um objeto de sessão com a descrição como null', () => {
      const sessionWithNullDesc = { ...mockValidSession, descricao: null };
      expect(() => createSessionSchema.parse(sessionWithNullDesc)).not.toThrow();
    });

    describe('Falhas de Validação', () => {
      it('deve falhar se cliente_id não for um inteiro', () => {
        const message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, cliente_id: 123.45 })
        );
        expect(message).toBe('ID do cliente deve ser um número inteiro.');
      });

      it('deve falhar se data_atendimento tiver formato inválido (sem T)', () => {
        const message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, data_atendimento: '2025-10-20 10:30:00' })
        );
        expect(message).toBe("Formato de data e hora inválido. Esperado 'YYYY-MM-DDTHH:mm:ss'.");
      });

      it('deve falhar se valor_sessao não for um número positivo', () => {
        const message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, valor_sessao: -10.00 })
        );
        expect(message).toBe('Valor da sessão deve ser um número positivo.');
      });

      it('deve falhar se valor_sessao tiver mais de 2 casas decimais', () => {
        const message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, valor_sessao: 150.555 })
        );
        expect(message).toContain('Valor da sessão deve ter no máximo 2 casas decimais.'); 
      });

      it('deve falhar se numero_sessao não for um inteiro positivo ou zero', () => {
        let message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, numero_sessao: -1 })
        );
        expect(message).toBe('Número da sessão deve ser um inteiro positivo.');

        message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, numero_sessao: 5.5 })
        );
        expect(message).toContain('expected int');
      });

      it('deve falhar se descricao exceder 240 caracteres', () => {
        const longDesc = 'a'.repeat(241);
        const message = getErrorMessage(() =>
          createSessionSchema.parse({ ...mockValidSession, descricao: longDesc })
        );
        expect(message).toBe('A descrição não pode exceder 240 caracteres.');
      });
    });
  });

  describe('updateSessionSchema', () => {
    it('deve validar um objeto de atualização com todos os campos parciais e estendidos', () => {
      expect(() => updateSessionSchema.parse(mockValidUpdate)).not.toThrow();
    });

    it('deve validar um objeto de atualização com apenas um campo do createSessionSchema', () => {
      expect(() => updateSessionSchema.parse({ valor_sessao: 200.00 })).not.toThrow();
    });

    it('deve validar um objeto de atualização com apenas um campo estendido', () => {
      expect(() => updateSessionSchema.parse({ realizado: true })).not.toThrow();
    });
    
    it('deve validar o motivo como null', () => {
      expect(() => updateSessionSchema.parse({ motivo: null })).not.toThrow();
    });

    describe('Falhas de Validação', () => {
      it('deve falhar se um campo parcial for fornecido com tipo inválido (ex: cliente_id)', () => {
        const message = getErrorMessage(() =>
          updateSessionSchema.parse({ cliente_id: 'abc' })
        );
        expect(message).toContain('expected number');
      });

      it('deve falhar se um campo estendido tiver tipo inválido (ex: realizado)', () => {
        const message = getErrorMessage(() =>
          updateSessionSchema.parse({ realizado: 'sim' })
        );
        expect(message).toBe("Invalid input: expected boolean, received string");
      });

      it('deve falhar se motivo exceder 255 caracteres', () => {
        const longMotivo = 'b'.repeat(256);
        const message = getErrorMessage(() =>
          updateSessionSchema.parse({ motivo: longMotivo })
        );
        expect(message).toBe('O motivo deve ter no máximo 255 caracteres.');
      });
    });
  });

  describe('changeStatusSchema', () => {
    it('deve validar um objeto de mudança de status válido', () => {
      expect(() => changeStatusSchema.parse({ realizado: true })).not.toThrow();
      expect(() => changeStatusSchema.parse({ realizado: false })).not.toThrow();
    });

    describe('Falhas de Validação', () => {
      it('deve falhar se realizado for omitido', () => {
        const message = getErrorMessage(() =>
          changeStatusSchema.parse({})
        );
        expect(message).toBe("Invalid input: expected boolean, received undefined");
      });

      it('deve falhar se realizado não for booleano', () => {
        const message = getErrorMessage(() =>
          changeStatusSchema.parse({ realizado: 1 })
        );
        expect(message).toBe("Invalid input: expected boolean, received number");
      });
    });
  });
});
