const express = require('express')
const router = express.Router()
// Import the controllers
const { register, login, logout } = require('../controllers/authController')

// POST
router.post('/register', register)
router.post('/login', login)
// GET
router.get('/logout', logout)

module.exports = router
