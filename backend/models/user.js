const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
		trim: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		minLength: 8,
		trim: true
	},
	email: {
		type: String,
		required: false
	},
});

const user = mongoose.model("user", userSchema);

module.exports = user;
