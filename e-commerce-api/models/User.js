// Mongoose required
const mongoose = require('mongoose')
// Npm validator.js - alternative to the match property
const validator = require('validator')
// Password hashing
const bcrypt = require('bcryptjs')

// Create a Schema - will define our json structure
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email-address'],
    validate: {
      // Validator.js
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    // Check if email already exist
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    // maxlength: 20,
  },
  // The user roles
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  // Authentication - email verification
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
})

// Hashing 🗯
// Pre hook, before we save the document we hash the password
// Use regular function - this keyword scope required
UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  // console.log(this.isModified('name'))
  // Only if we are updating the password, we will hash
  if (!this.isModified('password')) return
  // 10 rounds -> more = processing power required
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password 🗯
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

// Export the model and define a collection name
module.exports = mongoose.model('User', UserSchema)
