require('dotenv').config()
require('express-async-errors')
// Basic imports
const express = require('express')
const app = express()
// Extra  security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean') // cross site scripting
const rateLimiter = require('express-rate-limit') // limit the number of requests

// Connect DB
const connectDB = require('./db/connect')
// Authenticator setup for the contacts routes
const authenticateUser = require('./middleware/authentication')
// Routers
const authRouter = require('./routes/auth')
const contactsRouter = require('./routes/contacts')
// Error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Security packages
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, // 15 min.
    max: 100, // 100 calls per windowMs and IP
  })
)

// Invoke json() since we have POST routes
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.static('./public'))

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/contacts', authenticateUser, contactsRouter)

// Error handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    // Invoke database connection and pass the env
    app.listen(port, () =>
      console.log(`Server is listening on port ${port} 📡`)
    )
  } catch (error) {
    console.log(error)
  }
}
start()
