const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

// Register 🗯
const register = async (req, res) => {
  // Check if duplicate email
  const { email, name, password } = req.body
  const emailDuplicate = await User.findOne({ email })
  if (emailDuplicate) {
    throw new CustomError.BadRequestError('Email already in use')
  }

  // First account will be defined as admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // Only accept the name, email & password by default (ergo "user" role will be assigned)
  // Manually have to change to role admin
  const user = await User.create({ name, email, password, role })

  // Create JSON web token in utils - pass in whole user so we pass the whole object
  const tokenUser = createTokenUser(user)

  // Invoke attach cookie function in utils
  attachCookiesToResponse({ res, user: tokenUser })

  // Created (201 status) - in json pass: user & token
  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

// Login 🗯
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    // 400 error
    throw new CustomError.BadRequestError('Please provide email & password')
  }

  // Check if already user - we create the user instance
  const user = await User.findOne({ email })
  if (!user) {
    // 401 error
    throw new CustomError.UnauthenticatedError(
      'Please provide email & password'
    )
  }

  // Check if matching password - here we check the user instance not the model
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    // 401 error
    throw new CustomError.UnauthenticatedError('Password invalid')
  }

  // Create JSON web token in utils - pass in whole user so we pass the whole object
  const tokenUser = createTokenUser(user)

  // Invoke attach cookie function in utils
  attachCookiesToResponse({ res, user: tokenUser })

  // 200 created
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

// Logout 🗯
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    // Remove the cookie
    expires: new Date(Date.now()),
  })

  // Message here for development purpose
  res.status(StatusCodes.OK).json({ msg: 'You logged out successfully!' })
}

module.exports = { register, login, logout }
