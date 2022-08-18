// Middleware(also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins

// Authentication middleware Setup
const User = require('../models/User')
const jwt = require('jsonwebtoken') // jsonwebtoken library
const { UnauthenticatedError } = require('../errors') // 401 error

// Auth middleware function
const auth = async (req, res, next) => {
  // Get the header
  const authHeader = req.headers.authorization
  // Check for Bearer in header
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    // Throw 401 if false
    throw new UnauthenticatedError('Authentication invalid')
  }
  // If authorized we split on the whitespace and look for the 2nd item in the array
  const token = authHeader.split(' ')[1]
  try {
    // Decode the token and retrieve the payload
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user to the contact routes
    req.user = { userId: payload.userId, name: payload.name }

    // Attach the user to the contact routes - alternative!
    // const user = User.findById(payload.id).select("-password")
    // req.user = user

    // Call the next middleware
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
