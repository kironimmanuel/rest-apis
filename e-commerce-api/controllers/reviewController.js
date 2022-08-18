const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

// Public routes
// GET 🗯
const getAllReviews = async (req, res) => {
  // Populate method, response will contain the values defined in select - path must match the model property
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({
      path: 'user',
      select: 'name',
    })
  res.status(StatusCodes.OK).json({ reviews })
}

// GET 🗯
const getSingleReview = async (req, res) => {
  // Populate method, response will contain the values defined in select - path must match the model property
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({
      path: 'user',
      select: 'name',
    })
  if (!review) {
    throw new CustomError.NotFoundError(
      `Couldn't find review with id : ${reviewId}`
    )
  }
  res.status(StatusCodes.OK).json({ review })
}

// POST 🗯
const createReview = async (req, res) => {
  // Product and user id required to create the review
  //   const { product: productId } = req.body
  const { product: productId, user: userId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id : ${productId}`
    )
  }

  // Check if user already left a review on the same product
  const alreadySubmitted = await Review.findOne({
    product: productId,
    // user: req.user.userId,
    user: userId,
  })

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'You have already reviewed this product'
    )
  }
  //   req.body.user = req.user.userId
  req.body.user = userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ review })
}

// PATCH 🗯
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(
      `Couldn't find review with id : ${reviewId}`
    )
  }
  checkPermissions(req.user, review.user)
  // Review looking for those 3 values
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({ review })
}

// DELETE 🗯
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(
      `Couldn't find review with id : ${reviewId}`
    )
  }
  await review.remove()
  checkPermissions(req.user, review.user)
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Review has been removed successfully' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
