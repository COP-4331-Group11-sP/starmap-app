const express = require('express');
const userModel = require('../models/user');
const UserController = require('../controllers/user_controller.js')
const app = express();


app.post('/API/create-user', async (request, response) => {
  const user = new userModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/reset-password', UserController.resetPasswordEmail);
app.post('/reset/:idToken/:pwToken', UserController.resetPassword);

module.exports = app;
