const express = require('express')
const router = express.Router()
// Authentication middleware
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

// before /:id otherwise it will be treated as the query id
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

// /:id routes last
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
