const CustomError = require('../errors')

// Only admins are authorized to make GET single user requests
const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(typeof resourceUserId)
  if (requestUser.role === 'admin') return
  // Since resourceUserId is an object, we have to convert into a string
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError.UnauthorizedError(
    'Your are not authorized to access this route'
  )
}

module.exports = checkPermissions
