const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Books extends Model {}

Books.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    book_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview_link: {
      type: DataTypes.STRING,
      allowNull: true,
    }
   
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'books',
  }
);

module.exports = Books;
