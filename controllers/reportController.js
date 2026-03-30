const reportService = require("../services/reportService");

async function createReport(req, res) {
  try {
    const { descricao, denunciadoId, tipoDenunciado, denunciadoNome } =
      req.body;

    const denuncianteNome = req.user.nome;
    const denuncianteId = req.user.user_id;

    if (!descricao || descricao.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Descrição da denúncia é obrigatória",
      });
    }

    if (!denunciadoId || !tipoDenunciado || !denunciadoNome) {
      return res.status(400).json({
        success: false,
        message: "Dados do denunciado são obrigatórios",
      });
    }
    const denuncia = await denunciaService.criarDenuncia({
      descricao,
      denuncianteId,
      denuncianteNome,
      denunciadoId,
      denunciadoNome,
      tipoDenunciado,
    });

    return res.status(201).json({
      success: true,
      message: "Denúncia registrada com sucesso",
      data: denuncia,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllReports(req, res) {
  try {
    const denuncias = await denunciaService.getAllReports();

    return res.status(200).json({
      success: true,
      count: denuncias.length,
      data: denuncias,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getReportById(req, res) {
  try {
    const { id } = req.params;
    const denuncia = await denunciaService.buscarDenunciaPorId(id);

    return res.status(200).json({
      success: true,
      data: denuncia,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, respostaModerador } = req.body;

    const moderadorNome = req.user.nome;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status é obrigatório",
      });
    }

    const denuncia = await denunciaService.atualizarStatusDenuncia(
      id,
      status,
      moderadorNome,
      respostaModerador,
    );

    return res.status(200).json({
      success: true,
      message: "Status da denúncia atualizado com sucesso",
      data: denuncia,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteReport(req, res) {
  try {
    const { id } = req.params;
    await denunciaService.deletarDenuncia(id);

    return res.status(200).json({
      success: true,
      message: "Denúncia deletada com sucesso",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};
