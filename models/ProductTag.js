const { Model, DataTypes } = require('sequelize');
const Product=require('./Product')
const Tag=require('./Tag')
const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id:{
    
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    product_id: {
      type: DataTypes.INTEGER,
      references:{
        model:Product,
        key:Product.id
  
      }
     
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references:{
        model:Tag,
        key:Tag.id
  
      }
    },
  
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
