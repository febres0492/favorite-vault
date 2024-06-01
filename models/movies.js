const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Movies extends Model {}

Movies.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    director:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'movie',
}
)

module.exports = Movies;