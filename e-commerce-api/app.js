// Environmental variable
require('dotenv').config()
// Applies try, catch to all controllers automatically
require('express-async-errors')
const express = require('express')
const app = express()
// To access cookies - with each request a cookie will be sent
const cookieParser = require('cookie-parser')
// Security packages
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
// For image upload
const fileUpload = require('express-fileupload')
// Database connection
const connectDB = require('./db/connect')
// Authentication
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

// Middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Security
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// To get access to the json data in req.body (POST, PATCH requests)
app.use(express.json())
// Will sign our cookies
app.use(cookieParser(process.env.JWT_SECRET))
// File upload, setting up as static assets makes the public folder available
app.use(express.static('./public'))
app.use(fileUpload())

// Routes
app.use('/api/v1/auth', authRouter) // Public routes to authenticate
app.use('/api/v1/users', userRouter) // All user routes need authentication
app.use('/api/v1/products', productRouter) // getSingleProduct & getAllProducts are public
app.use('/api/v1/reviews', reviewRouter) // getAllReviews, getSingleReview are public
app.use('/api/v1/orders', orderRouter) // getAllOrders admin only

// Errors
app.use(notFoundMiddleware) // First roadblock - 404  doesn't invoke next()
app.use(errorHandlerMiddleware) // Error handler last - it only gets invoked from the existing route

// Setup start port variable - OR operator if 5000 not available
const port = process.env.PORT || 5000
const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URL)
    app.listen(port, console.log(`Server listening on port ${port} 📡`))
  } catch (error) {
    console.error(error)
  }
}
start()
