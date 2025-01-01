'use strict';
const {
  Model,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    profileImage:DataTypes.STRING,
    phone: DataTypes.INTEGER,
    isDeleted: DataTypes.TINYINT,
    isTestData: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};