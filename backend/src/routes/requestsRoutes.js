const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
