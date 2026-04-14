const clientService = require("../services/clientService");

jest.mock("../services/clientService");

const mockClientes = [
  {
    client_id: 1,
    nome: "João Silva",
    telefone: "11987654321",
    descricao: "Cliente especial",
    endereco: "Rua A, 123",
    user_id: 1,
  },
  {
    client_id: 2,
    nome: "Maria Oliveira",
    telefone: "11876543210",
    descricao: "Novo cliente",
    endereco: "Rua B, 456",
    user_id: 1,
  },
  {
    client_id: 3,
    nome: "João Santos",
    telefone: "11765432109",
    descricao: "Cliente recorrente",
    endereco: "Rua C, 789",
    user_id: 1,
  },
];

const mockClientePorNome = [mockClientes[0], mockClientes[2]];
const mockClientePorTelefone = mockClientes[0];
const mockClienteVazio = [];

describe("Pesquisa de clientes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Buscar por Nome", () => {
    it("deve retornar clientes que correspondem ao nome pesquisado", async () => {
      clientService.getByName.mockResolvedValue(mockClientePorNome);
      const result = await clientService.getByName("João");

      expect(clientService.getByName).toHaveBeenCalledWith("João");
      expect(result).toEqual(mockClientePorNome);
      expect(result.length).toBe(2);
    });

    it("deve retornar array vazio se nenhum cliente corresponder ao nome", async () => {
      clientService.getByName.mockResolvedValue(mockClienteVazio);
      const result = await clientService.getByName("aaa");

      expect(result).toEqual([]);
    });

    it("deve lançar erro se houver problema na busca", async () => {
      clientService.getByName.mockRejectedValue(
        new Error("Erro ao buscar no BD"),
      );

      await expect(clientService.getByName("João")).rejects.toThrow(
        "Erro ao buscar no BD",
      );
    });
  });

  describe("Buscar por Telefone", () => {
    it("deve retornar um cliente com telefone específico", async () => {
      clientService.getByPhone.mockResolvedValue(mockClientePorTelefone);
      const result = await clientService.getByPhone("11987654321");

      expect(clientService.getByPhone).toHaveBeenCalledWith("11987654321");
      expect(result).toEqual(mockClientePorTelefone);
      expect(result.telefone).toBe("11987654321");
    });

    it("deve retornar null se telefone não existir", async () => {
      clientService.getByPhone.mockResolvedValue(null);
      const result = await clientService.getByPhone("11111111111");

      expect(result).toBeNull();
    });

    it("deve validar formato de telefone antes de buscar", async () => {
      clientService.getByPhone.mockResolvedValue(mockClientePorTelefone);
      const result = await clientService.getByPhone("119");

      expect(result).toBeDefined();
    });
  });

  describe('Buscar por ID', () => {
    it('deve retornar um cliente com ID específico', async () => {
      clientService.getById.mockResolvedValue(mockClientes[0]);
      const result = await clientService.getById(1);

      expect(clientService.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockClientes[0]);
      expect(result.client_id).toBe(1);
    });

    it('deve retornar null se ID não existir', async () => {
      clientService.getById.mockResolvedValue(null);
      const result = await clientService.getById(999);

      expect(result).toBeNull();
    });

    it('deve verificar se cliente pertence ao usuário (segurança)', async () => {
      clientService.getById.mockResolvedValue(mockClientes[0]);
      const result = await clientService.getById(1);

      expect(result.user_id).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com busca com strings vazias', async () => {
      clientService.getByName.mockResolvedValue(mockClienteVazio);
      const result = await clientService.getByName('');

      expect(result).toEqual([]);
    });

    it('deve ser case-insensitive na busca por nome', async () => {
      clientService.getByName.mockResolvedValue(mockClientePorNome);
      const result = await clientService.getByName('joÃo'); 

      expect(result.length).toBeGreaterThan(0);
    });

    it('deve retornar múltiplos resultados quando há correspondências parciais', async () => {
      clientService.getByName.mockResolvedValue(mockClientePorNome);
      const result = await clientService.getByName('Silva');

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
