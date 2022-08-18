// Connect to the database
const mongoose = require('mongoose')

const connectDB = url => {
  // If mongoose V5 and lower -> this object negates the deprecation warnings
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
