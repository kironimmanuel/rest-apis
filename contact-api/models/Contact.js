const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide contact name'],
      maxlength: 50,
    },
    company: {
      type: String,
      maxlength: 50,
    },
    position: {
      type: String,
      maxlength: 50,
    },
    phone: {
      type: String,
      maxlength: 20,
    },
    email: {
      type: String,
      maxlength: 50,
    },
    createdBy: {
      // We tie the Job model to the User model 🗯
      type: mongoose.Types.ObjectId,
      // reference the User
      ref: 'User',
      // Need active User to create Job
      required: [true, 'Please provider user'],
    },
  },
  // mongoose Schemas have the timestamp option which auto creates the: createdBy, createdAt, updatedAt properties
  { timestamps: true }
)

module.exports = mongoose.model('Contact', ContactSchema)
