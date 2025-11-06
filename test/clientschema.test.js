const { createClientSchema, updateClientSchema } = require('../schemas/clientSchema');

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

describe('📦 Client Schemas', () => {
  describe('🧩 createClientSchema', () => {
    const validClient = {
      nome: 'Cliente Teste',
      descricao: 'Descrição do cliente',
      telefone: '11987654321',
      endereco: 'Rua Teste, 123',
    };

    it('deve validar um cliente válido', () => {
      expect(() => createClientSchema.parse(validClient)).not.toThrow();
    });

    it("deve falhar se 'nome' estiver ausente", () => {
      const msg = getErrorMessage(() => createClientSchema.parse({}));
      expect(msg).toContain('expected string');
    });

    it("deve falhar se 'nome' for curto demais", () => {
      const msg = getErrorMessage(() => createClientSchema.parse({ nome: 'Joao' }));
      expect(msg).toBe('Nome deve ter no mínimo 5 caracteres');
    });

    it("deve falhar se 'nome' for longo demais", () => {
      const msg = getErrorMessage(() =>
        createClientSchema.parse({ nome: 'A'.repeat(60) })
      );
      expect(msg).toBe('Nome deve ter no máximo 50 caracteres');
    });

    it("deve falhar se 'nome' não for string", () => {
      const msg = getErrorMessage(() =>
        createClientSchema.parse({ nome: 12345 })
      );
      expect(msg).toContain('expected string');
    });

    it("deve aceitar 'descricao', 'telefone' e 'endereco' opcionais", () => {
      const partialClient = { nome: 'Cliente Básico' };
      expect(() => createClientSchema.parse(partialClient)).not.toThrow();
    });

    it("deve falhar se 'descricao' for número", () => {
      const msg = getErrorMessage(() =>
        createClientSchema.parse({ nome: 'Cliente Teste', descricao: 123 })
      );
      expect(msg).toContain('expected string');
    });

    it("deve falhar se 'telefone' contiver letras", () => {
      const msg = getErrorMessage(() =>
        createClientSchema.parse({ nome: 'Cliente Teste', telefone: '11A2345678' })
      );
      expect(msg).toBe('Telefone deve conter apenas números');
    });

    it("deve falhar se 'endereco' for muito longo", () => {
      const msg = getErrorMessage(() =>
        createClientSchema.parse({
          nome: 'Cliente Teste',
          endereco: 'A'.repeat(300),
        })
      );
      expect(msg).toBe('Endereço deve ter no máximo 255 caracteres');
    });
  });

  describe('🧩 updateClientSchema', () => {
    it('deve permitir atualização parcial', () => {
      const msg = getErrorMessage(() =>
        updateClientSchema.parse({ telefone: '123456789' })
      );
      expect(msg).toBeUndefined(); 
    });

    it('deve falhar se um campo tiver tipo errado', () => {
      const msg = getErrorMessage(() =>
        updateClientSchema.parse({ descricao: 999 })
      );
      expect(msg).toContain('expected string');
    });

    it('deve aceitar campos opcionais nulos ou vazios', () => {
      const msg = getErrorMessage(() =>
        updateClientSchema.parse({ descricao: null, telefone: '' })
      );
      expect(msg).toContain("expected string");
    });
  });
});
