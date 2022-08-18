// import jsonData from './data.json'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import connectDB from './db/connect.js'
import Review from './models/Review.js'
dotenv.config()

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    // Remove existing data
    await Review.deleteMany()

    const jsonData = JSON.parse(
      await readFile(new URL('./data.json', import.meta.url))
    )
    await Review.create(jsonData)
    console.log('Database was populated successfully')
    // Terminates process after success
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
