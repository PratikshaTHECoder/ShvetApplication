'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubCategory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId:DataTypes.INTEGER,
    categoryName: DataTypes.STRING,
    isTestData: DataTypes.TINYINT,
    isDeleted: DataTypes.TINYINT,
  }, {
    sequelize,
    modelName: 'SubCategory',
  });
  
  return SubCategory;
};