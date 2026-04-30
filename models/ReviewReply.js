const { DataTypes } = require("sequelize");
const sequelize = require("../db/database.js");
const Review = require("./Review.js");
const User = require("./user.js");

const ReviewReply = sequelize.define("ReviewReply", {
  review_reply_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  autor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  autor_tipo: {
    type: DataTypes.ENUM("cliente", "tatuador"),
    allowNull: false,
  },
  resposta: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
});

Review.hasMany(ReviewReply, {
  foreignKey: "review_id",
  as: "respostas",
  onDelete: "CASCADE",
});
ReviewReply.belongsTo(Review, { foreignKey: "review_id", as: "review" });
ReviewReply.belongsTo(User, { foreignKey: "autor_id", as: "autor" });

module.exports = ReviewReply;
