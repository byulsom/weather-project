const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  orientation: {
    type: String,
    required: true,
  },
  tilt: {
    type: String,
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    required: true,
  },
 
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
