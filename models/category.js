'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    categoryName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryImage: DataTypes.STRING,
    subCategoryId: DataTypes.INTEGER,
    isTestData: DataTypes.TINYINT,
    isDeleted: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};