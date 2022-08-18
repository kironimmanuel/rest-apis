const CustomError = require('../errors')
const { verifyJWT } = require('../utils')

// First authentication level - user
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new CustomError.UnauthenticatedError(
      'Please login to access this route' // Auth failed
    )
  }
  try {
    // Destructure the payload
    const { name, userId, role } = verifyJWT({ token })
    // On the request object we will have te user
    req.user = { name, userId, role }
  } catch (error) {
    throw new CustomError.UnauthenticatedError(
      'Please login to access this route' // Auth failed
    )
  }
  // If authenticated pass to the next route
  next()
}

// The rest parameter (..."rest")  syntax allows a function to accept an indefinite number of arguments as an array, providing a way to represent variadic functions in JavaScript
const authorizePermissions = (...roles) => {
  // We must return a function here, so authorizePermissions will be a used as callback function in userRoutes.js (express necessity)
  return (req, res, next) => {
    // Since its an array we can use includes
    if (!roles.includes(req.user.role)) {
      // 403 error
      throw new CustomError.UnauthorizedError(
        'You are not authorized to access this route'
      )
    }
    // If our assigned roles (admin, owner, etc.) pass the check  - we proceed to the route
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
