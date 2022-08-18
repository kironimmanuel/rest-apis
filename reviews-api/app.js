// Express setup
import dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
const app = express()
dotenv.config()
// Database connection
import connectDB from './db/connect.js'
// Routes
import reviewsRouter from './routes/reviews.js'
// Custom errors
import errorMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'
// Security packages
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean' // cross site scripting

// Safety
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, // 15 min.
    max: 100, // 100 calls per windowMs and IP
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())

// Testing
app.get('/', (req, res) => {
  res.send('<h1>Reviews API</h1><a href="/api/v1/reviews">reviews route</a>')
})

// Reviews route
app.use('/api/v1/reviews', reviewsRouter)
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, console.log(`Server listening on port ${port} 📡`))
  } catch (error) {
    console.error(error)
  }
}

start()
