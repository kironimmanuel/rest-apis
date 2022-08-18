// Populate our database by invoking populate.js and automating the data stream
require('dotenv').config()

// 2nd connection over connect.js
const connectDB = require('./db/connect')

const Product = require('./models/product')

// .json important extension here
const jsonProducts = require('./products.json')

// Start 2nd connection
const start = async () => {
  try {
    // use .env environmental variable
    await connectDB(process.env.MONGO_URI)
    // Product from models/product -< Let's us start from scratch by removing the data (optional)
    await Product.deleteMany()
    // Dynamically creating products, by passing in jsonProducts
    await Product.create(jsonProducts)
    console.log('2nd connection')
    // Terminate process after success (like ctrl + c)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start()
