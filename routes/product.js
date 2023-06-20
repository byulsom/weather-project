const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Project = require('../models/project');
const Company = require('../models/company');

// Getting all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting product one company
router.get('/:companyId', getProduct, (req, res) => {
  res.json(res.product);
});


// Create new product
router.post('/', async (req, res) => {
  const { area, orientation, tilt, productname, companyId } = req.body;

  try {
    const currentDate = new Date(); // Get the current date and time

    const newProduct = new Product({
      companyId: companyId,
      area,
      orientation,
      tilt,
      productname,
      postedAt: currentDate, // Add the current date and time
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create new product' });
  }
});




// Update product
router.patch('/:id', async (req, res) => {
  const { area, orientation, tilt, productname, companyId } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.companyId = companyId;
    product.area = area;
    product.orientation = orientation;
    product.tilt = tilt;
    product.productname = productname;
    product.postedAt = new Date(); // Update the postedAt field with the current date and time

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


async function getProduct(req, res, next) {
  try {
    const companyId = req.params.companyId; // Access the companyId value from the route parameters
    // Query the database using the companyId to retrieve the product data
    const product = await Product.findOne({ companyId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.product = product; // Attach the product to the response object
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.product = product;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
