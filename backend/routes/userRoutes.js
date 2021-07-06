const express = require('express');
const userModel = require('../models/user');
const app = express();
const { Keccak } = require('sha3');

app.post('/create-user', async (request, response) => {
  const user = new userModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/update-password', async (request, response) => {
  // incoming: ID, password, retyped password
  // outgoing: updated password
  
  const { ID, Password1, Password2 } = request.body;
  const hash = new Keccak(256);
  
  if (Password1 == Password2) {
    hash.update(Password1);
    await userModel.findByIdAndUpdate({_id : ID}, { password : hash.digest('hex') },
      function (err, result) {
        if (err) response.send(err);
        else response.send('Updated Password');
    });
  }
  else {
    response.send('Passwords do not match.');
  }
});


module.exports = app;
