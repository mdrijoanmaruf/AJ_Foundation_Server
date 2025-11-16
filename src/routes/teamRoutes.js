const express = require('express');
const {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes
router.post('/', protect, admin, createTeamMember);
router.put('/:id', protect, admin, updateTeamMember);
router.delete('/:id', protect, admin, deleteTeamMember);

module.exports = router;
