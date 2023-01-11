const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Название товара должно быть',
  },
  description: {
    type: String,
    required: 'Описание должно быть',
  },
  price: {
    type: Number,
    required: 'Цена должно быть',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: 'Название категории должно быть',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category.Subcategory',
    required: 'Название подкатегории должно быть',
  },
  images: {
    type: [String],
  },
});

module.exports = connection.model('Product', productSchema);
