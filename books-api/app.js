require('dotenv').config();
// Instead of setting up try,catch middleware, we use express-async-errors
require('express-async-errors');
// Express setup
const express = require('express');
const app = express();
// Extra  security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean'); // cross site scripting
const rateLimiter = require('express-rate-limit'); // limit the number of requests
// Database connection
const connectDB = require('./db/connect');
// Routes import
const booksRouter = require('./routes/books');
// Custom errors
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// Safety
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, // 15 min.
    max: 100, // 100 calls per windowMs and IP
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// Testing
app.get('/', (req, res) => {
  res.send('<h1>Books RESTful API</h1><a href="/api/v1/books">books route</a>');
});

app.use('/api/v1/books', booksRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Dynamic port variable (default 5000)
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    // Connect to database using .env environmental variable
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening on port ${port} 📡`));
  } catch (error) {
    console.error(error);
  }
};

start();
