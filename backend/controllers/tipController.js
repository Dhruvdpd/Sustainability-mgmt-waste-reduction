const Tip = require('../models/Tip');

// @desc    Get all tips
// @route   GET /api/tips
// @access  Public
const getTips = async (req, res) => {
  try {
    const { category, approved } = req.query;
    let filter = {};

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Filter by approval status if provided
    if (approved !== undefined) {
      filter.isApproved = approved === 'true';
    }

    const tips = await Tip.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to fetch tips',
      error: error.message
    });
  }
};

// @desc    Create new tip
// @route   POST /api/tips
// @access  Public
const createTip = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      impact,
      author,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !author?.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and author name'
      });
    }

    const tip = await Tip.create({
      title,
      description,
      category,
      impact: {
        carbonReduction: impact?.carbonReduction || 0,
        costSavings: impact?.costSavings || 0,
        efficiencyGain: impact?.efficiencyGain || 0
      },
      author: {
        name: author.name,
        department: author.department || 'Sustainability'
      },
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Tip created successfully',
      data: tip
    });
  } catch (error) {
    console.error('Error creating tip:', error);
    
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
      message: 'Server Error - Unable to create tip',
      error: error.message
    });
  }
};

// @desc    Get single tip
// @route   GET /api/tips/:id
// @access  Public
const getTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tip
    });
  } catch (error) {
    console.error('Error fetching tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to fetch tip',
      error: error.message
    });
  }
};

// @desc    Update tip
// @route   PUT /api/tips/:id
// @access  Public
const updateTip = async (req, res) => {
  try {
    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tip updated successfully',
      data: tip
    });
  } catch (error) {
    console.error('Error updating tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to update tip',
      error: error.message
    });
  }
};

// @desc    Delete tip
// @route   DELETE /api/tips/:id
// @access  Public
const deleteTip = async (req, res) => {
  try {
    const tip = await Tip.findByIdAndDelete(req.params.id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to delete tip',
      error: error.message
    });
  }
};

// @desc    Like a tip
// @route   PUT /api/tips/:id/like
// @access  Public
const likeTip = async (req, res) => {
  try {
    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tip liked successfully',
      data: tip
    });
  } catch (error) {
    console.error('Error liking tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to like tip',
      error: error.message
    });
  }
};

// @desc    Get tips with search functionality
// @route   GET /api/tips/search
// @access  Public
const searchTips = async (req, res) => {
  try {
    const { query } = req.query;
    let searchFilter = {};

    if (query) {
      searchFilter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { 'author.name': { $regex: query, $options: 'i' } }
        ]
      };
    }

    const tips = await Tip.find(searchFilter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    console.error('Error searching tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Unable to search tips',
      error: error.message
    });
  }
};

module.exports = {
  getTips,
  createTip,
  getTip,
  updateTip,
  deleteTip,
  likeTip,
  searchTips
};