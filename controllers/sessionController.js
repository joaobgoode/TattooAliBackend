const sessionService = require('../services/sessionService');
const { validationResult } = require('express-validator');

const sessionController = {
  //criando uma nova sessão
  async createSession(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { cliente_id, data_atendimento, valor_sessao, numero_sessao, descricao } = req.body;
      const usuario_id = req.user.id;

      if (!cliente_id || !data_atendimento || !valor_sessao || !numero_sessao) {
        return res.status(400).json({ message: 'Campos obrigatórios em branco!' });
      }

      if (descricao && descricao.length > 240) {
        return res.status(400).json({ message: 'A descrição não pode exceder 240 caracteres.' });
      }

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
      console.error('Erro ao criar sessão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }

  },

  //buscando todas as sessões do usuário
  async getAll(req, res) {
    try {
      const usuario_id = req.user.id;
      const sessions = await sessionService.getAll(usuario_id);
      res.json(sessions);
    } catch (error) {
      console.error('Erro ao obter sessões:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  //buscando sessôes por ID
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
      console.error('Erro ao obter sessão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  //buscando sessões por ID do cliente
  async getByClientId(req, res) {
    try {
      const usuario_id = req.user.id;
      const { clientId } = req.params;

      const sessions = await sessionService.getByClientId(usuario_id, clientId);
      res.json(sessions);
    } catch (error) {
      console.error('Erro ao obter sessões:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  //buscando sessões por data
  async getByDate(req, res) {
    try {
      const usuario_id = req.user.id;
      const { date } = req.params;

      if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Data inválida' });
      }

      const sessions = await sessionService.getByDate(usuario_id, date);
      res.json(sessions);
    } catch (error) {
      console.error('Erro ao obter sessões:', error);
      res.status(500).json({ message: 'Erro ao obter sessões.' });
    }
  },

  //atualizando uma sessão
  async updateSession(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const usuario_id = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const sessionExists = await sessionService.verifySession(usuario_id, id);
      if (!sessionExists) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      if (updateData.descricao && updateData.descricao.length > 240) {
        return res.status(400).json({ message: 'A descrição não pode exceder 240 caracteres.' });
      }

      const updateSession = await sessionService.updateSession(id, updateData);
      res.json(updateSession);
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      res.status(500).json({ message: 'Erro ao atualizar sessão.' });
    }
  },

  //mudando o status de uma sessão
  async changeStatus(req, res) {
    try {
      const usuario_id = req.user.id;
      const { id } = req.params;
      const { realizado } = req.body;

      if (typeof realizado !== 'boolean') {
        return res.status(400).json({ message: 'resposta invalida' });
      }

      const sessionExists = await sessionService.verifySession(usuario_id, id);
      if (!sessionExists) {
        return res.status(404).json({ message: 'Sessão não encontrada.' });
      }

      const updatedSession = await sessionService.changeStatus(id, realizado);
      res.json(updatedSession);

    } catch (error) {
      console.error('Erro ao alterar status da sessão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  //apagando uma sessão
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
      console.error('Erro ao deletar sessão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

module.exports = sessionController
