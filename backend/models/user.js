const mongoose = require("mongoose");
const Schema = mongoose.Schema;// Create Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minLength: [8, 'password must have at least 8 characters'],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    required: true,
    default : false
  },
});module.exports = user = mongoose.model("users", userSchema);
