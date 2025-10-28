const express = require('express');
const router = express.Router();
const {
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');
const { protect, authorize } = require('../middlewares/authMiddleware');
router.get('/', protect, authorize('admin'), getOrganizations);
router.get('/:id', protect, getOrganizationById);
router.put('/:id', protect, authorize('admin'), updateOrganization);
router.delete('/:id', protect, authorize('admin'), deleteOrganization);
module.exports = router;