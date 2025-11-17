const express = require('express');
const {
  getAllPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/programController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllPrograms);
router.get('/:id', getProgram);

// Admin routes
router.post('/', protect, admin, createProgram);
router.put('/:id', protect, admin, updateProgram);
router.delete('/:id', protect, admin, deleteProgram);

module.exports = router;
