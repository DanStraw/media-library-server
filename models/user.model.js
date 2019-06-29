const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password cannot contain "password"');
      }
    }
  },
})

module.exports = mongoose.model("User", UserSchema, "users")