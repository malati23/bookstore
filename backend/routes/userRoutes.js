const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
