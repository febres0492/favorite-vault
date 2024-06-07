const User = require('./User')
const Favorites = require('./Favorites')

User.hasMany(Favorites, { foreignKey: 'userId' })
Favorites.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
    User,
    Favorites
}