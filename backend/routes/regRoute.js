const express = require('express');
const app = express.Router();

const UserController = require('../controllers/user_controller.js');

app.post('/register', UserController.register);

module.exports = app;