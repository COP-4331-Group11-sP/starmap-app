const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user.js');
const PORT = ":5001";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
	    user: process.env.EMAIL_USERNAME,
	    pass: process.env.EMAIL_PASSWORD,
	},
});

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
  const { Password1, Password2 } = req.body;

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
    if (Password1 == Password2) {
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
      
      const hash = bcrypt.hashSync(Password1, saltRounds);
      
      try {
       await User.findByIdAndUpdate({ _id : idPayload.ID}, {password : hash});
       await User.save();
       return res.status(200).send({
        message: "Updated Password"
        });
      } catch (err) {
        return res.status(500).send(err);
      }    
    }    
  } catch (err) {
    return res.status(400).send({
      message : "Password Mismatch"
      });
  }
}

exports.register = async (req, res) => {
    const { email } = req.body;
    // Check we have an email
    if (!email) {
       return res.status(422).send({ message: "Missing email." });
    }
    try{
       // Check if the email is in use
       const existingUser = await User.findOne({ email }).exec();
       if (existingUser) {
          return res.status(409).send({ 
                message: "Email is already in use."
          });
        }
       // Step 1 - Create and save the user
       const user = await new User(req.body).save();
       // Step 2 - Generate a verification token with the user's ID
       const verificationToken = user.generateVerificationToken();
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
