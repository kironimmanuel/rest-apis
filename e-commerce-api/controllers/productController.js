const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')

// Public routes
// GET 🗯
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products })
}

// GET 🗯
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId }).populate('reviews')
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id : ${productId}`
    )
  }
  res.status(StatusCodes.OK).json({ product })
}

// Admin routes
// POST 🗯
const createProduct = async (req, res) => {
  // user is the property we set up in the model
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

// PATCH 🗯
const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  // findOneAndUpdate(1. ID, 2. request body, 3. options)
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidator: true,
  })
  if (!product) {
    throw new NotFoundError(`Couldn't find product with id : ${productId}`)
  }
  res.status(StatusCodes.OK).json({ product })
}

// POST 🗯
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError(
      'Something went wrong while uploading the file, please try again'
    )
  }
  const productImage = req.files.image
  // Check if the file is a image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload an image file')
  }
  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      `File must not be bigger than ${Math.trunc(maxSize / 1000)} MB`
    )
  }
  // Using express-fileupload, we get access to the mv: [Function: mv] method
  // Import const path = require("path")
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  // Set the image path
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

// DELETE 🗯
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id : ${productId}`
    )
  }
  // remove() will trigger the hook - findOneAndDelete() doesn't
  await product.remove()
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Product has been removed successfully' })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
