// Middleware(also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins
const { CustomAPIError } = require('../errors')
// Status codes library -> npm install http-status-codes --save
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  // Create custom error object
  let customError = {
    // Set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong please try again later',
  }
  // Since we check for the status code with the customError, we don't need CustomAPIError in the error-handler
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // Validation Error
  if (err.name === 'ValidationError') {
    // err -> errors -> then all values and map the returning array to retrieve the msg
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      // Join the error messages
      .join(', ')
    customError.statusCode = 400
  }

  // Duplicate Error - Check if err has the property -> then check for 11000 error
  if (err.code && err.code === 11000) {
    // Get the keyValue property from the error object with Object.keys()
    customError.msg = `${Object.keys(
      err.keyValue
    )} already in use, please choose another one`
    customError.statusCode = 400
  }

  // Cast Error
  if (err.name === 'CastError') {
    // err -> errors -> then all values and mao the returning array to retrieve the msg
    customError.msg = `${err.value} was not found, please try again`
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
