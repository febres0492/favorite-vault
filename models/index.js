const Movies = require('./movies');
const Users = require('./users');
const MovieWatchlist = require('./movieWatchList');

Users.belongsToMany(Movies,
    {through: MovieWatchlist, foreignKey:'user_id'}
)

Movies.belongsToMany(Users, 
    {through: MovieWatchlist, foreignKey:'movie_id'}
)


module.exports = { Movies, Users, MovieWatchlist};