const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const users = require('./users');
const movies = require('./movies');


class MovieWatchlist extends Model {}

MovieWatchlist.init({
    user_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:users,
            key:'id',
        },
    },
    movie_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:movies,
            key:'id',
        },
    },
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'movie_watchlist',
}
)

module.exports = MovieWatchlist;