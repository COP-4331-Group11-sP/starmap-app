const express = require('express');
const { check } = require('express-validator');
const UserController = require('../controllers/user_controller.js')
const app = express();



app.post('/api/signup',[
  // Empty and Format validations
  check('username', "Please Enter a Valid Username").not().isEmpty(),
  check('email', "Please enter a valid email")
    .isEmail()
    .not().isEmpty(),
  check('password', "Please enter a valid password")
    .not().isEmpty()
    .isLength({min: 8})
], UserController.register);

app.post( "/api/login",[
  check('username', "Please Enter a Valid Username").not().isEmpty(),
  check("password", "Please enter a valid password").isLength({ min: 8 })
], UserController.login);

app.post('/api/reset-password', UserController.resetPasswordEmail);

app.post('/api/reset/:idToken/:pwToken', [
  check("password", "Please enter a valid password").isLength({ min: 8 })
], UserController.resetPassword);

app.post('/api/verify-email', UserController.verifyEmail);

app.get('/api/verify/:verificationToken', UserController.verify);

module.exports = router;
