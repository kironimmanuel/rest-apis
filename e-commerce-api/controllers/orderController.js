const Order = require('../models/Order')
const Product = require('../models/Product')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { checkPermissions } = require('../utils')
// To fake the stripe API
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'fakeClientSecret'
  return { client_secret, amount }
}

// GET 🗯
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate({
    path: 'user',
    select: 'name',
  })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

// GET 🗯
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError(
      `Couldn't find order with id : ${orderId}`
    )
  }
  checkPermissions(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}

// GET 🗯
const getCurrentUserOrders = async (req, res) => {
  // find orders where user is equal to req.user.userId
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

// POST 🗯
// From frontend we need: shipping fee, tax, cart items
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No items currently in your cart')
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'No tax or shipping fee provided, please try again'
    )
  }

  // We construct/fill this array by running our logic below
  let orderItems = []
  let subtotal = 0

  // We can't use forEach/map, since we have asynchronous operation inside the loop
  // We use for of loop in this case to iterate of the cartItems
  for (const item of cartItems) {
    // item.product contains the id
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `Couldn't find product with id : ${item.product}`
      )
    }
    // Either item.product or _id form dbProduct
    const { name, price, image } = dbProduct

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: item.product,
    }
    // Add order items to order array
    orderItems = [...orderItems, singleOrderItem]
    // Calculate subtotal, don't override!
    subtotal += item.amount * price
  }
  const total = subtotal + tax + shippingFee
  // Communicate with stripe to get the client secret
  // In this case we use a function to fake it
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

// PATCH 🗯
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body

  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError(
      `Couldn't find order with id : ${orderId}`
    )
  }
  checkPermissions(req.user, order.user)

  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
