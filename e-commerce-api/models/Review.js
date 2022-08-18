const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide review rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: [50, 'Comment must be less than 50 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
      maxlength: [500, 'Comment must be less than 500 characters'],
    },
    // We can access the properties below using populate() in the controller
    user: {
      // Get current user id
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      // Get current product id
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  // mongoose Schemas have the timestamp option which auto creates the: createdBy, createdAt, updatedAt properties
  { timestamps: true }
)

// Setup compound index to assure user can only leave 1 review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      // 1. Aggregation stage
      $match: { product: productId },
    },
    {
      // 2. Aggregation stage - the grouping stage
      $group: {
        // Either null or "$product" - since we are getting the entire list, we go with null
        _id: null,
        // Our rating,numOfReviews property on the Review model
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])
  console.log(result)
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        // ?. Optional chaining
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    )
  } catch (error) {
    console.error(error)
  }
}

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
