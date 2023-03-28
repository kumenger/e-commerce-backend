const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");
Category.hasMany(Product, {
  foreignKey: "category_id",

  //onDelete: 'CASCADE',
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
