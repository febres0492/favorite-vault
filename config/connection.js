const Sequelize = require('sequelize');

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
    }
  );
// const sequelize = new Sequelize(process.env.POSTGRESURL,
//   {dialectOptions:{
//     ssl:{require:true}
//   }}
// )

module.exports = sequelize;
