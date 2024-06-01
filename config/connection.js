const Sequelize = require('sequelize');

const sequelize =  new Sequelize(process.env.POSTGRESURL,{
    dialectOptions: {
        ssl: {
            require: true,
        }
    }
}
);

module.exports = sequelize;
