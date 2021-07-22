const express = require('express');
const app = express.Router();

const UserController = require('../controllers/user_controller.js');

app.post('/API/register', UserController.register);
app.get('/verify/:verificationToken', UserController.verify);

module.exports = app;
