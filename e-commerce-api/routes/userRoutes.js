const express = require('express')
const router = express.Router()
// Authentication middleware
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')

// 1. Authenticate user then admin - order important
router
  .route('/')
  // We have to return a callback in authentication.js - otherwise authorizePermission will invoke directly
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser) // Must be above the /:id
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
// /:id last router - order important
router.route('/:id').get(authenticateUser, getSingleUser) // Must be last route, otherwise following query strings will be treated as id's

module.exports = router
