require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean'); // cross site scripting
const rateLimiter = require('express-rate-limit'); // limit the number of requests
const connectDB = require('./db/connect');
const booksRouter = require('./routes/books');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

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

app.get('/', (req, res) => {
  res.send('<h1>Books RESTful API</h1><a href="/api/v1/books">books route</a>');
});

app.use('/api/v1/books', booksRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening on port ${port} 📡`));
  } catch (error) {
    console.error(error);
  }
};

start();
