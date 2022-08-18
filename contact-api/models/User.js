const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Create a Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // 1. boolean 2. conditional message
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    // 1. boolean 2. conditional message
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    // Not a validator, creates unique index for every email -> to check duplicates
    unique: true,
  },
  password: {
    type: String,
    // 1. boolean 2. conditional message
    required: [true, 'Please provide password'],
    minlength: 6,
    // Remove max length, since it will conflict with the hashing
    // maxlength: 12,
  },
})

// Pre middleware functions execute one after another, when each middleware calls next()
// Async/await instead of next() will do the same
// Regular function here since we need the "this" keyword pointing to this document
UserSchema.pre('save', async function () {
  // Salting password - random bytes and pass num of rounds (more = more secure, will need more processing power )
  const salt = await bcrypt.genSalt(10)
  // Hashing password (password on this document) add the salt
  this.password = await bcrypt.hash(this.password, salt)
})

// Regular function here since we need the "this" keyword pointing to this document
UserSchema.methods.createJWT = function () {
  // Object - payload
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

// bcrypt - compare the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
