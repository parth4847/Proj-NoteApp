const mongoose = require('mongoose');

// defining the strict structure for our user data
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    // automatically creates and manages createdAt and updatedAt dates
    timestamps: true 
  }
);

// export the model so we can use it in our controllers
module.exports = mongoose.model('User', userSchema);