const notificationService = require('../services/notificationService.js');

async function getMyNotifications(req, res) {
  try {
    const rows = await notificationService.listByUser(req.user.id);
    return res.status(200).json(rows);
  } catch {
    return res.status(500).json({ message: 'Erro ao carregar notificacoes.' });
  }
}

async function markAllAsRead(req, res) {
  try {
    const updated = await notificationService.markAllAsRead(req.user.id);
    return res.status(200).json({ updated });
  } catch {
    return res.status(500).json({ message: 'Erro ao marcar notificacoes.' });
  }
}

async function markOneAsRead(req, res) {
  const id = Number.parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ message: 'ID de notificacao invalido.' });
  }
  try {
    const ok = await notificationService.markOneAsRead(req.user.id, id);
    if (!ok) return res.status(404).json({ message: 'Notificacao nao encontrada.' });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: 'Erro ao marcar notificacao.' });
  }
}

module.exports = {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
};
