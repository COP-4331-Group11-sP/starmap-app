const mongoose = require("mongoose");

const faveSchema = new mongoose.Schema({
  displayId: {
    type: String,
    required: true
  },
  starId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
});

const fave = mongoose.model("favorites", faveSchema);

module.exports = fave;