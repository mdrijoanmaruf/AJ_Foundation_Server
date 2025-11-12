const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Get all users - protected, admin only
router.get('/', protect, admin, getUsers);

// Update user role - protected, admin only
router.patch('/:id/role', protect, admin, updateUserRole);

module.exports = router;
