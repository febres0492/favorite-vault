const User = require('./User')
const Favorites = require('./Favorites')
const Token = require('./token');

User.hasMany(Favorites, { foreignKey: 'userId', onDelete: 'CASCADE' })
Favorites.belongsTo(User, { foreignKey: 'userId' })

User.hasOne(Token,{foreignKey:'email', onDelete:'CASCADE'})
Token.belongsTo(User, {foreignKey:'email'})

module.exports = {
    User,
    Favorites,
    Token
}