const { DataTypes } = require('sequelize');
const sequelize = require('../db/database.js');
const User = require('./user.js'); // Importa o modelo User para criar a relação

const Photo = sequelize.define('Photo', {
  photo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Armazena apenas o nome/chave do arquivo na nuvem (ex: "imagem-123.jpg")',
    get() {
      const rawValue = this.getDataValue('url');
      // Segue o mesmo padrão do seu model User para montar a URL completa
      return rawValue ? `${process.env.PUBLIC_BUCKET_URL}/${rawValue}` : null;
    }
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true // Um título opcional para a foto
  },
  descricao: {
    type: DataTypes.TEXT, // TEXT permite descrições mais longas que STRING
    allowNull: true // Uma descrição opcional
  }
});

// --- A PARTE MAIS IMPORTANTE ---
// Define a relação: Uma Foto (Photo) pertence a um Usuário (User).
// Isso criará automaticamente uma chave estrangeira 'usuario_id' na tabela de Photos.
Photo.belongsTo(User, { foreignKey: 'user_Id', as: 'user' });

// --- OPCIONAL, MAS RECOMENDADO ---
// Você também pode adicionar a relação inversa no seu arquivo 'user.js'.
// Isso facilita consultas do tipo "me dê todas as fotos deste usuário".
// No arquivo user.js, você adicionaria:
// User.hasMany(Photo, { foreignKey: 'usuario_id', as: 'fotos' });


module.exports = Photo;
