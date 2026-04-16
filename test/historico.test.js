const sessionService = require('../services/sessionService');
const Session = require('../models/Session');
const Client = require('../models/Client');

jest.mock('../models/Session', () => ({
  findAll: jest.fn(),
}));

jest.mock('../models/Client', () => ({}));

describe('Histórico de sessoões dos clientes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o histórico completo de sessões para um cliente (passadas, do dia e futuras)', async () => {
    const today = new Date('2026-04-16T12:00:00Z');
    const pastDate = '2026-04-10T10:00:00Z'; 
    const todayDate = '2026-04-16T14:00:00Z'; 
    const futureDate = '2026-04-20T10:00:00Z'; 

    const mockSessions = [
      {
        sessao_id: 1,
        cliente_id: 10,
        usuario_id: 1,
        data_atendimento: pastDate,
        valor_sessao: 150.00,
        numero_sessao: 1,
        descricao: 'Sessão passada',
        realizado: true,
        cancelado: false,
        cliente: {
          client_id: 10,
          nome: 'João Silva',
          telefone: '11999999999',
          descricao: 'Cliente regular',
          endereco: 'Rua A, 123'
        }
      },
      {
        sessao_id: 2,
        cliente_id: 10,
        usuario_id: 1,
        data_atendimento: todayDate,
        valor_sessao: 200.00,
        numero_sessao: 2,
        descricao: 'Sessão do dia',
        realizado: false,
        cancelado: false,
        cliente: {
          client_id: 10,
          nome: 'João Silva',
          telefone: '11999999999',
          descricao: 'Cliente regular',
          endereco: 'Rua A, 123'
        }
      },
      {
        sessao_id: 3,
        cliente_id: 10,
        usuario_id: 1,
        data_atendimento: futureDate,
        valor_sessao: 250.00,
        numero_sessao: 3,
        descricao: 'Sessão futura',
        realizado: false,
        cancelado: false,
        cliente: {
          client_id: 10,
          nome: 'João Silva',
          telefone: '11999999999',
          descricao: 'Cliente regular',
          endereco: 'Rua A, 123'
        }
      }
    ];

    Session.findAll.mockResolvedValue(mockSessions);

    const result = await sessionService.getByClientId(1, 10);

    expect(Session.findAll).toHaveBeenCalledWith({
      where: { cliente_id: 10, usuario_id: 1, cancelado: false },
      include: [
        {
          model: Client,
          as: 'cliente',
          attributes: ['client_id', 'nome', 'telefone', 'descricao', 'endereco']
        }
      ]
    });
    expect(result).toEqual(mockSessions);
    expect(result).toHaveLength(3);
    expect(result.some(s => new Date(s.data_atendimento) < today)).toBe(true);
    expect(result.some(s => new Date(s.data_atendimento).toDateString() === today.toDateString())).toBe(true);
    expect(result.some(s => new Date(s.data_atendimento) > today)).toBe(true);
  });

  it('deve retornar uma lista vazia se não houver sessões para o cliente', async () => {
    Session.findAll.mockResolvedValue([]);

    const result = await sessionService.getByClientId(1, 999);

    expect(result).toEqual([]);
  });

  it('deve lançar erro se o banco de dados falhar', async () => {
    Session.findAll.mockRejectedValue(new Error('Erro no banco de dados'));

    await expect(sessionService.getByClientId(1, 10)).rejects.toThrow('Erro no banco de dados');
  });
});