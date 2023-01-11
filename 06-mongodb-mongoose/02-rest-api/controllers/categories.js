const mongoose = require('mongoose');
module.exports.categoryList = async function categoryList(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(40, 'category not found');
  }

  const category = await Category.findById(ctx.params.id);

  if (!category) {
    ctx.throw(404, 'category not found');
  }

  ctx.body = {categories: category.populate('subcategory')};
};