const mongoose = require('mongoose')

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    // If one of the values in SingleCartItemSchema is missing, user won't be able to submit the order
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'paid', 'delivered', 'canceled', 'failed'],
      default: 'pending',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    // Zahlungsabsichts id
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
