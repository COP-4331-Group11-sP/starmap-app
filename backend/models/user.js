const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
 username: {
	type: String,
	required: [true, 'must create username'],
	trim: true
},
 password: {
	type: String,
	minLength: [8, 'password must have at least 8 characters'],
	required: [true, 'must create password'],
	trim: true
},
 email: {
	type: String,
	required: [true, 'Must include email'],
	trim: true
},
 verified: {
	 type: Boolean,
	 required: true,
	 default: false
},
});

// prevents duplicate emails
userSchema.path('email').validate(async (email) => {
  const emailCount = await mongoose.models.user.countDocuments({ email })
  return !emailCount
}, 'Email already exists');

// prevents duplicate usernames
userSchema.path('username').validate(async (username) => {
	const userCount = await mongoose.models.user.countDocuments({ username })
	return !userCount
  }, 'User already exists');

// JWT TOKENS GENERATED
userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const secret = process.env.VERIFICATION_TOKEN;

    const verificationToken = jwt.sign(
        { ID: user._id },
        secret,
        { expiresIn: "1h" }
    );

    return verificationToken;
};

userSchema.methods.generateIDToken = function () {
	const user = this;
	const secret = process.env.RESET_TOKEN;
	
	const idToken = jwt.sign(
			{ ID: user._id },
			secret,
			{ expiresIn: "1h" }
	);

	return idToken;
};

userSchema.methods.generateResetToken = function () {
	const user = this;
	const secret = user.password + "-" + process.env.RESET_TOKEN;

	const pwToken = jwt.sign(
			{ ID: user._id },
			secret,
			{ expiresIn: "1h" }
	);

	return pwToken;
};

const user = mongoose.model("user", userSchema);

module.exports = user; 
