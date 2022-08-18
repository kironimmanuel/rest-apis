const createTokenUser = user => {
  // JSON web token
  return { name: user.name, userId: user._id, role: user.role }
}

module.exports = createTokenUser
