const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tip title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Tip description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['packaging', 'transportation', 'storage', 'energy', 'waste', 'supply-chain'],
    default: 'packaging'
  },
  impact: {
    carbonReduction: {
      type: Number,
      default: 0,
      min: [0, 'Carbon reduction cannot be negative']
    },
    costSavings: {
      type: Number,
      default: 0,
      min: [0, 'Cost savings cannot be negative']
    },
    efficiencyGain: {
      type: Number,
      default: 0,
      min: [0, 'Efficiency gain cannot be negative']
    }
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    department: {
      type: String,
      default: 'Sustainability'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  isApproved: {
    type: Boolean,
    default: false
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
tipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tip', tipSchema);