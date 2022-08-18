// Imports
const Contact = require('../models/Contact')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// All controller functions need the userId, in app.js we set auth an all contact routes 🗯
// We "crud" only contacts associated with the user 🗯

// GET
const getAllContacts = async (req, res) => {
  // Only retrieve "All Contacts" associated with the current user
  const contacts = await Contact.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  )
  // Count is specified on the frontend
  res.status(StatusCodes.OK).json({ contacts, count: contacts.length })
}

// GET
// router.route('/:id').get(getContact).delete(deleteContact).patch(updateContact)
const getContact = async (req, res) => {
  // We get id since we specified the query param as /:id
  const {
    user: { userId },
    params: { id: contactId },
  } = req
  // Contact model - we check for the contact id and the associated user id
  const contact = await Contact.findOne({
    _id: contactId,
    createdBy: userId,
  })
  if (!contact) {
    throw new NotFoundError(`No contact with id : ${contactId} found`)
  }
  res.status(StatusCodes.OK).json({ contact })
}

// POST
const createContact = async (req, res) => {
  // we added createdBy property in the Contact model
  req.body.createdBy = req.user.userId
  const contact = await Contact.create(req.body)
  res.status(StatusCodes.CREATED).json({ contact })
}

// PATCH - patch verb requires a body
const updateContact = async (req, res) => {
  const {
    body: { company, position, name, phone, email },
    user: { userId },
    params: { id: contactId },
  } = req

  if (name === '') {
    throw new BadRequestError('Please provide a contact name')
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!contact) {
    throw new NotFoundError(`No contact with id : ${contactId} found`)
  }
  res.status(StatusCodes.OK).json({ contact })
}

// DELETE
const deleteContact = async (req, res) => {
  const {
    user: { userId },
    params: { id: contactId },
  } = req

  const contact = await Contact.findOneAndRemove({
    _id: contactId,
    createdBy: userId,
  })
  if (!contact) {
    throw new NotFoundError(`No contact with id : ${contactId} found`)
  }
  // If contact deleted successfully, we only respond with 200
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
}
// Crud functionality -> create, read, update & delete

// Controller functions get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser. A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests.
