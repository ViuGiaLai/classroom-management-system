// src/routes/materialRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadMaterial } = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware'); // Kiểm tra có file này

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route upload file
router.post('/', protect, upload.single('file'), uploadMaterial);

module.exports = router;
