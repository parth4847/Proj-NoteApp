const mongoose = require('mongoose');

// defining the strict structure for our private notes
const noteSchema = new mongoose.Schema(
  {
    // we override the default object id with a custom string for the unique shareable url
    _id: {
      type: String,
      required: true
    },
    // links the note to a specific user if they are logged in
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    // this is the hashed password required to unlock the note
    password: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0 // This is the TTL Index. MongoDB automatically deletes the document when Date.now() >= expiresAt
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Note', noteSchema);