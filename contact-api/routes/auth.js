const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth')

// 1. Option
// router.post('/register', register)
// router.post('/login', login)

// 2. Option
router.route('/register').post(register)
router.route('/login').post(login)

// Router will export all defined routes
module.exports = router

// Routes forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.
