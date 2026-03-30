const Report = require("../models/Report");
const User = require("../models/user")
const Client = require("../models/Client")

async function createReport(data) {
  try {
    const denunciante = await User.findByPk(data.denuncianteId);
    if (!denunciante) {
      throw new Error('Denunciante não encontrado');
    }

    let denunciadoExistente = null;
    if (data.tipoDenunciado === 'user') {
      denunciadoExistente = await User.findByPk(data.denunciadoId);
    } else if (data.tipoDenunciado === 'client') {
      denunciadoExistente = await Client.findByPk(data.denunciadoId);
    }

    if (!denunciadoExistente) {
      throw new Error('Denunciado não encontrado');
    }

    const denunciaExistente = await Report.findOne({
      where: {
        denunciante: data.denuncianteNome,
        denunciado: data.denunciadoNome,
        status: ['pendente', 'analisando']
      }
    });
    
    if (denunciaExistente) {
      throw new Error('Você já denunciou este usuário e a denúncia ainda está sendo processada');
    }
    
    // Criar a denúncia
    const denuncia = await Report.create({
      descricao: data.descricao,
      status: 'pendente',
      denunciante: data.denuncianteNome,
      denunciado: data.denunciadoNome,
      moderador: 'nenhum',
      cliente_id: data.tipoDenunciado === 'client' ? data.denunciadoId : null,
      usuario_id: data.tipoDenunciado === 'user' ? data.denunciadoId : data.denuncianteId
    });
    
    return denuncia;
  } catch (error) {
    throw error;
  }
}

async function getAllReports() {
  try {
    const denuncias = await Report.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        },
        {
          model: Client,
          as: 'client',
          attributes: ['client_id', 'nome', 'descricao', 'telefone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return denuncias;
  } catch (error) {
    throw error;
  }
}

async function getReportById(id) {
  try {
    const denuncia = await Report.findByPk(id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        },
        {
          model: Client,
          as: 'client',
          attributes: ['client_id', 'nome', 'descricao', 'telefone']
        }
      ]
    });
    
    if (!denuncia) {
      throw new Error('Denúncia não encontrada');
    }
    
    return denuncia;
  } catch (error) {
    throw error;
  }
}

async function deleteReport(id) {
  try {
    const denuncia = await Report.findByPk(id);
    
    if (!denuncia) {
      throw new Error('Denúncia não encontrada');
    }
    
    await denuncia.destroy();
    
    return denuncia;
  } catch (error) {
    throw error;
  }
}

async function updateReport(id, status, moderadorNome, respostaModerador) {
  try {
    const denuncia = await Report.findByPk(id);
    
    if (!denuncia) {
      throw new Error('Denúncia não encontrada');
    }
    
    const statusValidos = ['pendente', 'analisando', 'resolvida', 'rejeitada'];
    if (!statusValidos.includes(status)) {
      throw new Error('Status inválido');
    }
    
    const updateData = {
      status: status,
      moderador: moderadorNome
    };
    
    if (respostaModerador && (status === 'resolvida' || status === 'rejeitada')) {
      updateData.respostaModerador = respostaModerador;
    }
    
    await denuncia.update(updateData);
    
    
    const denunciaAtualizada = await buscarDenunciaPorId(id);
    
    return denunciaAtualizada;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createReport,
  getReportById,
  getAllReports,
  deleteReport,
  updateReport,
};
