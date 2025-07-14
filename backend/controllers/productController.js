const Product = require('../models/Product');
const XLSX = require('xlsx');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to fetch products',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      transport,
      storage,
      packaging,
      carbonFootprint
    } = req.body;

    // Validate required fields
    if (!name || !transport || !storage || !packaging || !carbonFootprint) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const product = await Product.create({
      name,
      category,
      transport: {
        type: transport.type || transport,
        distance: transport.distance || 100
      },
      storage: {
        type: storage.type || storage,
        duration: storage.duration || 30,
        energy: storage.energy || 0
      },
      packaging,
      carbonFootprint
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to create product',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to fetch product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to update product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to delete product',
      error: error.message
    });
  }
};

// @desc    Export products to Excel
// @route   GET /api/products/export
// @access  Public
const exportProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    // Transform data for Excel export
    const excelData = products.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Transport Type': product.transport.type,
      'Transport Distance (km)': product.transport.distance,
      'Storage Type': product.storage.type,
      'Storage Duration (days)': product.storage.duration,
      'Storage Energy (kWh)': product.storage.energy,
      'Packaging': product.packaging,
      'Carbon Footprint (kg CO2)': product.carbonFootprint,
      'Created Date': new Date(product.createdAt).toLocaleDateString(),
      'Updated Date': new Date(product.updatedAt).toLocaleDateString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=sustainability-products-report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to export products',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  exportProducts
};