const express = require('express');
const {
  getTips,
  createTip,
  getTip,
  updateTip,
  deleteTip,
  likeTip,
  searchTips
} = require('../controllers/tipController');

const router = express.Router();

// Routes for /api/tips
router.route('/')
  .get(getTips)
  .post(createTip);

router.route('/search')
  .get(searchTips);

router.route('/:id')
  .get(getTip)
  .put(updateTip)
  .delete(deleteTip);

router.route('/:id/like')
  .put(likeTip);

module.exports = router;