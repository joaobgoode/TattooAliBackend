const sessionService = require('../services/sessionService')
const Session = require('../models/Session')

jest.mock('../models/Session', () => ({
    findAll: jest.fn(),
}));

const mockSessionsValidas = [
  {
    sessao_id: 1,
    cliente_id: 123,
    usuario_id: 1,
    data_atendimento: new Date('2026-11-10T10:00:00'),
    valor_sessao: 150.50,
    numero_sessao: 1,
    descricao: 'Tatuagem de braço',
    realizado: false,
    cancelado: false,
    cliente: { client_id: 123, nome: 'João Silva', telefone: '11987654321' }, // Incluindo dados do cliente (via include)
  },
  {
    sessao_id: 2,
    cliente_id: 456,
    usuario_id: 1,
    data_atendimento: new Date('2026-11-10T14:00:00'),
    valor_sessao: 200.00,
    numero_sessao: 2,
    descricao: 'Tatuagem de perna',
    realizado: true,
    cancelado: false,
    cliente: { client_id: 456, nome: 'Maria Oliveira', telefone: '11876543210' },
  },
];

const mockSessionsVazias = [];

describe('Agenda do Tatuador', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('deve retornar sessões para uma data válida', async () => {
        Session.findAll.mockResolvedValue(mockSessionsValidas)

        const result = await sessionService.getByDate(1, '2026-11-10');

        expect(Session.findAll).toHaveBeenCalledWith({
            where: expect.objectContaining({
                usuario_id: 1,
                data_atendimento: expect.any(Object),
                cancelado: false
            }),
            include: expect.any(Array)
        });
        expect(result).toEqual(mockSessionsValidas);
    });

    it('deve retornar array vazio se não houver sessões', async () => {
        Session.findAll.mockResolvedValue(mockSessionsVazias)

        const result = await sessionService.getByDate(1, '2026-11-10');

        expect(result).toEqual(mockSessionsVazias);
    });

    it('deve lançar erro se o DB falhar', async () => {
        Session.findAll.mockRejectedValue(new Error('Erro de conexão'));

        await expect(sessionService.getByDate(1, '2026-11-10')).rejects.toThrow('Erro de conexão');
    });

    it('deve filtrar apenas sessões não canceladas', async () => {
        const mockSessionsComCanceladas = [
            ...mockSessionsValidas,
            {
                sessao_id: 3,
                cliente_id: 789,
                usuario_id: 1,
                data_atendimento: new Date('2025-11-10T16:00:00'),
                cancelado: true, // Sessão cancelada
                cliente: { client_id: 789, nome: 'Pedro Santos' }
            }
        ];
        Session.findAll.mockResolvedValue(mockSessionsValidas);

        const result = await sessionService.getByDate(1, '2026-11-10');

        expect(result).toEqual(mockSessionsValidas);
        expect(result).not.toContainEqual(expect.objectContaining({ cancelado: true}));

    });
});