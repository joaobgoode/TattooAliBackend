
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
        tipo_denunciado: data.tipoDenunciado, // Inclui o tipo de denunciado na verificação
        ...(data.tipoDenunciado === 'user'
          ? { reported_user_id: data.denunciadoId }
          : { reported_client_id: data.denunciadoId }),
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
      denunciante_nome: data.denuncianteNome, // Atualizado para denunciante_nome
      denunciado_nome: data.denunciadoNome,   // Atualizado para denunciado_nome
      moderador: 'nenhum',
      reported_client_id: data.tipoDenunciado === 'client' ? data.denunciadoId : null,
      reported_user_id: data.tipoDenunciado === 'user' ? data.denunciadoId : null,
      denunciante_user_id: data.denuncianteId,
      tipo_denunciado: data.tipoDenunciado // Armazena o tipo da entidade denunciada para uso no frontend.
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
          as: 'denuncianteUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        },
        {
          model: Client,
          as: 'reportedClient',
          attributes: ['client_id', 'nome', 'descricao', 'telefone']
        },
        { // Adicionado para incluir o usuário denunciado, se for o caso
          model: User,
          as: 'reportedUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']] // Usando o nome do campo do modelo
    });
    
    return denuncias;
  } catch (error) {
    throw error;
  }
}

async function getReportsByDenuncianteId(denuncianteUserId) { // Renomeado para maior clareza
  try {
    const denuncias = await Report.findAll({
      include: [
        {
          model: User,
          as: 'denuncianteUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        },
        {
          model: Client,
          as: 'reportedClient',
          attributes: ['client_id', 'nome', 'descricao', 'telefone']
        },
        { // Adicionado para incluir o usuário denunciado, se for o caso
          model: User,
          as: 'reportedUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        }
      ],
      where: { // Filtra as denúncias pelo ID do usuário denunciante
        denunciante_user_id: denuncianteUserId // Usando o novo nome do campo
      },
      order: [['created_at', 'DESC']] // Usando o nome do campo do modelo
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
          as: 'denuncianteUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
        },
        {
          model: Client,
          as: 'reportedClient',
          attributes: ['client_id', 'nome', 'descricao', 'telefone']
        },
        { // Adicionado para incluir o usuário denunciado, se for o caso
          model: User,
          as: 'reportedUser',
          attributes: ['user_id', 'nome', 'sobrenome', 'email', 'role']
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
    
    
    const denunciaAtualizada = await getReportById(id);
    
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
  updateReport, // Exporta a nova função
  getReportsByDenuncianteId,
};