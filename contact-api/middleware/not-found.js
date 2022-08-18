// Middleware(also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins
const notFound = (req, res) => res.status(404).send('Route does not exist')

module.exports = notFound
