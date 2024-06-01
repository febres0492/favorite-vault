const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
        customsecurecheck(value) {
          if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
          }
          if (!/[a-z]/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
          }
          if (!/[^A-Za-z0-9]/.test(value)) {
            throw new Error('Password must contain at least one special character');
          }
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        console.log(user.password)
        user.password = await bcrypt.hash(user.password, 10);
        console.log(user.password)
      },
      beforeUpdate: async (userNew) => {
        if (userNew.changed('password')) {
          userNew.password = await bcrypt.hash(userNew.password, 10);
        }
      },
    },
    sequelize, 
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;