const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

// Get dashboard statistics (admin only)
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
