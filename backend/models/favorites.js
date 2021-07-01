const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  starname: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
});

const favorites = mongoose.model("favorites", favoritesSchema);

module.exports = favorites;