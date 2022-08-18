const jwt = require('jsonwebtoken')

// Setting up the parameter as object -> so order doesn't matter
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const verifyJWT = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

// Cookie, we attach the response object
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })
  const oneDay = 1000 * 60 * 60 * 24
  // Attach cookie - 1. "token" 2. token 3. options
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    // In production only send over https
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = {
  createJWT,
  verifyJWT,
  attachCookiesToResponse,
}
