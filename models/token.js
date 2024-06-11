const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Token extends Model { }

// const randomToken = Math.random().toString(36).slice(2, 8);

Token.init({
    user_email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
        },
        references:{
                model: 'user',
                key: 'email',
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull:false
    }
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'token',
}
)

module.exports = Token;