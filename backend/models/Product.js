const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'clothing', 'food', 'home'],
    default: 'electronics'
  },
  transport: {
    type: {
      type: String,
      required: [true, 'Transport type is required'],
      enum: ['truck', 'ship', 'plane', 'rail'],
      default: 'truck'
    },
    distance: {
      type: Number,
      required: [true, 'Transport distance is required'],
      min: [0, 'Distance cannot be negative']
    }
  },
  storage: {
    type: {
      type: String,
      required: [true, 'Storage type is required'],
      enum: ['ambient', 'refrigerated', 'frozen'],
      default: 'ambient'
    },
    duration: {
      type: Number,
      default: 30,
      min: [0, 'Storage duration cannot be negative']
    },
    energy: {
      type: Number,
      default: 0,
      min: [0, 'Energy consumption cannot be negative']
    }
  },
  packaging: {
    type: String,
    required: [true, 'Packaging type is required'],
    enum: ['minimal', 'standard', 'protective'],
    default: 'standard'
  },
  carbonFootprint: {
    type: Number,
    required: [true, 'Carbon footprint is required'],
    min: [0, 'Carbon footprint cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);