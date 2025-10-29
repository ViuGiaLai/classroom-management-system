const express = require('express');
const { registerOrganization, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5,
  message: 'Too many login attempts. Please wait a minute.',
});

router.post('/register', registerOrganization);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);

module.exports = router;
