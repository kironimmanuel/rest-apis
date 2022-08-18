const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // We use spread operator here, so mongoose does all the validation
  const user = await User.create({ ...req.body })
  // Invoke the function from the UserSchema in models
  const token = user.createJWT()
  // Alternative - frontend can decode the name value (token always necessary)
  // We send the name here, since our frontend is expecting response with name value
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  // Check for inputs
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // Check if already user
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid email or password')
  }

  // Check if matching password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid email or password')
  }

  // If user exists and credentials match we create jwt
  const token = user.createJWT()
  // Alternative - frontend can decode the name value (token always necessary)
  // We send the name here, since our frontend is expecting response with name value
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }

// Controller functions get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser. A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests.
