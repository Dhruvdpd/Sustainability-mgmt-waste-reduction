const express = require('express');
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  exportProducts
} = require('../controllers/productController');

const router = express.Router();

// Routes for /api/products
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/export')
  .get(exportProducts);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;