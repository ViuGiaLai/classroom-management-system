const express = require('express');
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentClasses,
  assignClassToDepartment,
  removeClassFromDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), createDepartment);
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

// Class assignment endpoints
router.get('/:id/classes', protect, getDepartmentClasses);
router.post('/:id/classes', protect, authorize('admin'), assignClassToDepartment);
router.delete('/:id/classes/:classId', protect, authorize('admin'), removeClassFromDepartment);

module.exports = router;
