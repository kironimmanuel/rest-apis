const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [50, 'Product name must be less than 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [500, 'Product description must be less than 500 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide product company'],
      // Enums are types that contain a limited number of fixed values
      // enum either array or object containing the array of values
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        // {VALUE} if a company is not supported we return the message
        message: 'Company {VALUE} was not found, please try again',
      },
    },
    color: {
      // Since we set colors as array
      type: [String],
      default: ['#222222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    // Only admins authorized to create Product 🗯
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  // mongoose Schemas have the timestamp option which auto creates the: createdBy, createdAt, updatedAt properties
  // toJSON sets up this model to accept virtuals
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Virtual property, not able to query it
// Setup the connection between Review and Product
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
  // match: { rating: 5 },
})

// Removing the product will remove all associated reviews
// Mongoose update doesn't require the next parameter
ProductSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', ProductSchema)
