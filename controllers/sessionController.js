const sessionService = require('../services/sessionService');
const { belongsToUser } = require('../services/clientService.js');
const { createSessionSchema, updateSessionSchema, changeStatusSchema } = require('../schemas/sessionSchema');

const sessionController = {

  async createSession(req, res) {

    const validationResult = createSessionSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue =>
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ');
      return res.status(400).json({ message: `Dados inválidos: ${errorMessages}` });
    }

    const { cliente_id, data_atendimento, valor_sessao, numero_sessao, descricao } = validationResult.data;
    const usuario_id = req.user.id;

    try {
      const newSession = {
        cliente_id,
        usuario_id,
        data_atendimento,
        valor_sessao,
        numero_sessao,
        descricao
      };

      const session = await sessionService.createSession(newSession);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getAll(req, res) {
    const { cliente } = req.query;
    if (cliente) {
      req.cliente = cliente;
      return await sessionController.getByClientId(req, res);
    }
    const { data } = req.query;
    if (data) {
      return await sessionController.getByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const sessions = await sessionService.getAll(usuario_id);
      return res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getById(req, res) {
    try {
      const usuario_id = req.user.id;
      const { id } = req.params;

      const session = await sessionService.getById(usuario_id, id);
      if (!session) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getByClientId(req, res) {
    try {
      const usuario_id = req.user.id;
      const clientId = req.cliente;

      const sessions = await sessionService.getByClientId(usuario_id, clientId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { data } = req.query;

      // Validação de data transferida para o Zod (embora aqui só cheque a presença/formato básico)
      if (!data) {
        return res.status(400).json({ message: 'Data inválida' });
      }

      const sessions = await sessionService.getByDate(usuario_id, data);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao obter sessões.' });
    }
  },

  async updateSession(req, res) {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const validationResult = updateSessionSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue =>
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ');
      return res.status(400).json({ message: `Dados inválidos: ${errorMessages}` });
    }

    const updateData = validationResult.data;

    try {
      const sessionExists = await sessionService.verifySession(usuario_id, id);
      if (!sessionExists) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      const updateSession = await sessionService.updateSession(id, updateData);
      res.json(updateSession);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar sessão.' });
    }
  },

  async changeStatus(req, res) {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const validationResult = changeStatusSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue =>
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ');
      return res.status(400).json({ message: `Dados inválidos: ${errorMessages}` });
    }

    const { realizado } = validationResult.data; // Apenas 'realizado' é esperado aqui

    try {
      const sessionExists = await sessionService.verifySession(usuario_id, id);
      if (!sessionExists) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      const updatedSession = await sessionService.changeStatus(id, realizado);
      res.json(updatedSession);

    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async deleteSession(req, res) {
    try {
      const usuario_id = req.user.id;
      const { id } = req.params;

      const sessionExists = await sessionService.verifySession(usuario_id, id);
      if (!sessionExists) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      await sessionService.deleteSession(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getPendingSessions(req, res) {
    const { data } = req.query;
    if (data) {
      req.query.date = data;
      return await sessionController.getPendingSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const sessions = await sessionService.getPendingSessions(usuario_id);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getRealizedSessions(req, res) {
    const { data } = req.query;
    if (data) {
      req.query.date = data;
      return await sessionController.getRealizedSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const sessions = await sessionService.getRealizedSessions(usuario_id);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getCanceledSessions(req, res) {
    const { data } = req.query;
    if (data) {
      req.query.date = data;
      return await sessionController.getCanceledSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const sessions = await sessionService.getCanceledSessions(usuario_id);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientPendingSessions(req, res) {
    const { data } = req.query;
    if (data) {
      return await sessionController.getClientPendingSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      if (!await belongsToUser(clienteId, usuario_id)) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
      const sessions = await sessionService.getClientPendingSessions(usuario_id, clienteId);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientRealizedSessions(req, res) {
    const { data } = req.query;
    if (data) {
      return await sessionController.getClientRealizedSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      if (!await belongsToUser(clienteId, usuario_id)) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
      const sessions = await sessionService.getClientRealizedSessions(usuario_id, clienteId);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientCanceledSessions(req, res) {
    const { data } = req.query;
    if (data) {
      return await sessionController.getClientCanceledSessionsByDate(req, res);
    }
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      if (!await belongsToUser(clienteId, usuario_id)) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
      const sessions = await sessionService.getClientCanceledSessions(usuario_id, clienteId);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getPendingSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { data } = req.query;
      // Validação básica de data aqui, Zod pode ser usado para validação mais rigorosa do query param
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getPendingSessionsByDate(usuario_id, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getRealizedSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { data } = req.query;
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getRealizedSessionsByDate(usuario_id, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getCanceledSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { data } = req.query;
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getCanceledSessionsByDate(usuario_id, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientPendingSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      const { data } = req.query;
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getClientPendingSessionsByDate(usuario_id, clienteId, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientRealizedSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      const { data } = req.query;
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getClientRealizedSessionsByDate(usuario_id, clienteId, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async getClientCanceledSessionsByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { clienteId } = req.params;
      const { data } = req.query;
      if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ message: 'Data inválida' });
      }
      const sessions = await sessionService.getClientCanceledSessionsByDate(usuario_id, clienteId, data);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

module.exports = sessionController;