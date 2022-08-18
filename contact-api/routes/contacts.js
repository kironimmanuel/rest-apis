const express = require('express')
const router = express.Router()

const {
  createContact,
  getAllContacts,
  getContact,
  deleteContact,
  updateContact,
} = require('../controllers/contacts')

// Chaining methods that share the same url
router.route('/').post(createContact).get(getAllContacts)
router.route('/:id').get(getContact).delete(deleteContact).patch(updateContact)

// Router will export all defined routes
module.exports = router

// Routes forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.
