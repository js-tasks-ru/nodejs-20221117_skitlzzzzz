const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Название подкатегории должно быть',
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Название категории должно быть',
  },
  subcategories: {
    type: [subCategorySchema],
  },
});

module.exports = connection.model('Category', categorySchema);
