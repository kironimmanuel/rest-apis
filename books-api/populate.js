// Populate our database by invoking populate.js and automating the data stream
require('dotenv').config();

// 2nd connection over connect.js
const connectDB = require('./db/connect');

const Data = require('./models/book');

// .json important extension here
const jsonData = require('./data.json');

// Start 2nd connection
const start = async () => {
  try {
    // use .env environmental variable
    await connectDB(process.env.MONGO_URI);
    // Book from models/book -> Let's us start from scratch by removing the data (optional)
    await Data.deleteMany();
    // Dynamically creating books, by passing in jsonData
    await Data.create(jsonData);
    console.log('2nd connection');
    // Terminate process after success (like ctrl + c)
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
