import mongoose from 'mongoose'
const ReviewSchema = new mongoose.Schema({
  // API structure
  id: {
    type: Number,
    required: [true, 'Id required'],
  },
  name: {
    type: String,
    required: [true, 'Name required'],
  },

  email: {
    type: String,
    required: [true, 'Email required'],
  },
  avatar: {
    type: String,
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    required: [true, 'Rating required'],
    default: 3.5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    // Mongoose gives us easy access to the current Date/Time
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model('Review', ReviewSchema)
