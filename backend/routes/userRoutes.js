const express = require("express");
const path = require('path');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const user = require('../models/user');


//signup
router.post('/signup',[
    // Empty and Format validations
    check('username', "Please Enter a Valid Username").not().isEmpty(),
    check('email', "Please enter a valid email")
      .isEmail()
      .not().isEmpty(),
    check('password', "Please enter a valid password")
      .not().isEmpty()
      .isLength({min: 8})
	],async(req, res) => {
		
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  // request entries
  const { username, email, password } = req.body;

  // check for unique email and username
  let Email = await user.findOne({
      email
  });

  if (Email) {
    return res.status(400).json({
      msg: "Email Already Exists"
    });
  }
  
  let userName = await user.findOne({
      username
    });
  if (userName) {
    return res.status(400).json({
      msg: "username Already Exists"
    });
  }

  // user is created
	const User = new user({
		username: username,
        email: email,
        password: password
	})
	try {
			const newUser = await User.save()
			res.status(201).json(newUser)
	}catch(err){
		console.log(err.message);
		res.status(500).send("Error in Saving");
	}
});

//login
router.post( "/login",[
    check('username', "Please Enter a Valid Username").not().isEmpty(),
    check("password", "Please enter a valid password").isLength({ min: 8 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      let signIn = await user.findOne({ username });
      if (!signIn){
        return res.status(400).json({message: "user Not Exist"});
      }
      if (!password === signIn.password){
        return res.status(400).json({ message: "Incorrect Password !"});
      }
      //return res.send("ciao");
      return res.status(200).json({})
    }catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server Error" });
    }
  });
module.exports = router;
