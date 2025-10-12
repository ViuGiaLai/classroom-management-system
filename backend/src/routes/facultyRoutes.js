const express = require('express');
const {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), createFaculty);
router.get('/', protect, getFaculties);
router.get('/:id', protect, getFacultyById);
router.put('/:id', protect, authorize('admin'), updateFaculty);
router.delete('/:id', protect, authorize('admin'), deleteFaculty);

module.exports = router;
