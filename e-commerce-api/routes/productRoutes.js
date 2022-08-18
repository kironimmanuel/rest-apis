const express = require('express')
const router = express.Router()
// Authentication middleware
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController')

const { getSingleProductReviews } = require('../controllers/reviewController')

// createProduct admin only, getAllProducts public route
router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'), createProduct)
  .get(getAllProducts)

// uploadImage admin only
// must be before the /:id route, otherwise uploadImage will be treated as the id
router
  .route('/uploadImage')
  .post(authenticateUser, authorizePermissions('admin'), uploadImage)

// updateProduct & deleteProduct admin only, getSingleProduct public route
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct)

// Alternative to mongoose virtuals - let's us use the query
router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router
