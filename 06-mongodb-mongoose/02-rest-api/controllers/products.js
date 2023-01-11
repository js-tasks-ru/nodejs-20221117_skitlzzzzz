const mongoose = require('mongoose');
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory: subcategory});

  if (!products) {
    ctx.throw(404, 'no products in subcategory');
  }

  ctx.body = {products: []};
};

module.exports.productList = async function productList(ctx, next) {
  const products = Product.find();

  if (!products) {
    ctx.throw(404, 'product not found');
  }

  ctx.body = products;
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(404, 'product not found');
  }

  const products = await Product.findById(ctx.params.id);

  if (!products) {
    ctx.throw(404, 'product not found');
  }

  ctx.body = products;
};

