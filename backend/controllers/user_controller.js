const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const saltRounds = 10;
const User = require('../models/user.js');
const PORT = ":5004";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
	    user: process.env.EMAIL_USERNAME,
	    pass: process.env.EMAIL_PASSWORD,
	},
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // request entries
  const { username, email, password } = req.body;

  // check for unique email and username
  let Email = await User.findOne({
      email
  });

  if (Email) {
    return res.status(400).json({
      msg: "Email Already Exists"
    });
  }

  let userName = await User.findOne({
      username
    });
  if (userName) {
    return res.status(400).json({
      msg: "username Already Exists"
    });
  }

  const hash = bcrypt.hashSync(password, saltRounds);

  // user is created
  const user = new User({
    username: username,
        email: email,
        password: hash
  })
  try {
      const newUser = await user.save()
      res.status(201).json(newUser)
  }catch(err){
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
}

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let signIn = await User.findOne({ username });
    if (!signIn){
      return res.status(400).json({message: "User Not Exist"});
    }
    const validPassword = await bcrypt.compareSync(password, signIn.password);
    if (!validPassword){
      return res.status(400).json({ message: "Invalid Password"});
    }
    
    return res.status(200).json({signIn._id})
  }catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
}

exports.resetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
      return res.status(404).send({ 
        message: "User does not exist"
      });
    }
    // Make tokens
    const resetToken = existingUser.generateResetToken();
    const idToken = existingUser.generateIDToken();
    // Make unique URL REMEBER TO CHANGE PORT
    const url = `http://constellario.xyz${PORT}/reset/${idToken}/${resetToken}`
    // Send email
    transporter.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `Click <a href = '${url}'>here</a> to reset your password.`
    })
    return res.status(201).send({
      message: `Sent password reset email to ${email}`
    });
  } catch(err){
    return res.status(500).send(err);
  }
}

exports.resetPassword = async (req, res) => {
  const { idToken, pwToken } = req.params;
  const { password } = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors})
  }


  if (!idToken || !pwToken) {
    return res.status(422).send({
      message : "Missing Token"
    });
  }

  // confirms ID
  let idPayload = null;
  try {
    idPayload = jwt.verify(
      idToken,
      process.env.RESET_TOKEN
    );
  } catch(err) {
    return res.status(500).send(err);
  }

  // updates password
  try {
    const user = await User.findOne({ _id: idPayload.ID});
    const secret = user.password + "-" + process.env.RESET_TOKEN;
      
    // checks password hasn't been changed
    let pwPayload = null;
    try {
      pwPayload = jwt.verify(
        pwToken, 
        secret
      );
    } catch(err) {
      return res.status(500).send(err);
    }
      
    const hash = bcrypt.hashSync(password, saltRounds);

    try {
     await User.findByIdAndUpdate({ _id : idPayload.ID}, {password : hash});
     return res.status(200).send({
      message: "Updated Password"
      });
    } catch (err) {
      return res.status(500).send(err);
    }       
  } catch (err) {
    return res.status(500).send(err);
  }
}

exports.verifyEmail = async (req, res) => {
    const { email } = req.body;
    // Check we have an email
    if (!email) {
       return res.status(422).send({ message: "Missing email." });
    }
    try{
       // Find user
       const existingUser = await User.findOne({ email }).exec();
       // Step 2 - Generate a verification token with the user's ID
       const verificationToken = existingUser.generateVerificationToken();
       // Step 3 - Email the user a unique verification link
       const url = `http://constellario.xyz${PORT}/verify/${verificationToken}`
       transporter.sendMail({
         to: email,
         subject: 'Verify Account',
         html: `Click <a href = '${url}'>here</a> to confirm your email.`
       })
       return res.status(201).send({
         message: `Sent a verification email to ${email}`
       });
   } catch(err){
       return res.status(500).send(err);
   }
}

exports.verify = async (req, res) => {
  const { verificationToken } = req.params;
  
  // Check we have an id
  if (!verificationToken) {
      return res.status(422).send({ 
           message: "Missing Token" 
      });
  }
  

  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
      payload = jwt.verify(
         verificationToken,
         process.env.VERIFICATION_TOKEN
      );
  } catch (err) {
      return res.status(500).send(err);
  }

  try{
      // Step 2 - Find user with matching ID
      const user = await User.findOne({ _id: payload.ID });
      if (!user) {
         return res.status(404).send({ 
            message: "User does not  exists" 
         });
      }
      // Step 3 - Update user verification status to true
      try {
        await User.findByIdAndUpdate({ _id : payload.ID}, { verified : true });
        return res.status(200).send({
            message: "Account Verified"
        }); 
      } catch (err) {
      return res.status(500).send(err);
      }
      
  } catch (err) {
  return res.status(500).send(err);
  }
}
