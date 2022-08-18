const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require('../utils')

// Only for admin roles ave access 🗯
const getAllUsers = async (req, res) => {
  console.log(req.user)
  // '-password' remove the password from the response
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}

// getSingleUser 🗯
const getSingleUser = async (req, res) => {
  // '-password' remove the password from the response
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    // 404 error
    throw new CustomError.NotFoundError(
      `Couldn't find user with id : ${req.params.id}`
    )
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}

// showCurrentUser 🗯
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

// updateUser with user.save() 🗯
const updateUser = async (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide name and email')
  }

  const user = await User.findOne({ _id: req.user.userId })
  user.email = email
  user.name = name
  await user.save()

  // We need to create a new token and attack cookie to the response
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

// updateUserPassword 🗯
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!newPassword || !oldPassword) {
    throw new CustomError.BadRequestError(
      'Please provide your old and new password'
    )
  }
  const user = await User.findOne({ _id: req.user.userId })
  // Check if current password is correct
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      'Password not correct, please try again'
    )
  }
  // New password must be different to the old password
  if (newPassword === oldPassword) {
    throw new CustomError.BadRequestError(
      'Your new password can not be the same as your old password. Please choose a new password'
    )
  }
  user.password = newPassword
  // save() if we want to create a new or update an existing document
  await user.save()
  // To help frontend a bit, pass in a message
  res.status(StatusCodes.OK).json({ msg: 'Password successfully updated' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}

// const updateUser = async (req, res) => {
//   const { name, email } = req.body

//   if (!name || !email) {
//     throw new CustomError.BadRequestError('Please provide name and email')
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   )

//   // We need to create a new token and attack cookie to the response
//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenUser })

//   res.status(StatusCodes.OK).json({ user: tokenUser })
// }
