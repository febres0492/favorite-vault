const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Favorites extends Model { }

Favorites.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            }
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        itemType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemData: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        itemImg:{
            type: DataTypes.STRING,
            allowNull:true,
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'favorites',
    }
);

module.exports = Favorites;
