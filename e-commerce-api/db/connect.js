// Mongoose v6
const mongoose = require('mongoose')

const connectDB = url => {
  return mongoose.connect(url)
}

module.exports = connectDB

// If mongoose v5 or lower
// return mongoose.connect(url, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// })
