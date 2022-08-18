// Setting up the Schema for our database structure
const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
  // API structure
  name: {
    type: String,
    // Input required, otherwise custom error message
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    // Input required, otherwise custom error message
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    // Default value
    default: false,
  },
  rating: {
    type: Number,
    // Default value
    default: 4,
  },
  createdAt: {
    // Mongoose gives us easy access to the current Date/Time
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    // Set limits to the values we want
    enum: {
      values: ['munchkin', 'ikea', 'ashley', 'gambino', 'williams'],
      // {VALUE} custom error message, when searching a non existing company
      message: '{VALUE} was not found',
    },
  },
  image: {
    type: String,
  },
})

module.exports = mongoose.model('Product', ProductSchema)
