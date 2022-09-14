const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'book id must be provided'],
  },
  name: {
    type: String,
    required: [true, 'book name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'book price must be provided'],
  },
  image: {
    type: String,
  },
  featured: {
    type: Boolean,
  },
  author: {
    type: String,
    required: [true, 'book author must be provided'],
  },
  rating: {
    type: Number,
    default: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: String,
    enum: {
      values: [
        'novel',
        'fiction',
        'thriller',
        'crime',
        'fantasy',
        'horror',
        'non-fiction',
        'historical',
      ],
      message: '{VALUE} was not found',
    },
  },
  shipping: {
    type: Boolean,
  },
});

module.exports = mongoose.model('Book', BookSchema);
