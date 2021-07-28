const express = require('express');
const FaveController = require('../controllers/fave_controller.js');
const app = express();

app.post('/api/add-favorites', FaveController.addFave);

app.post('/api/update-favorites', FaveController.updateFave);

app.delete('/api/delete-favorites', FaveController.deleteFave);

app.post('/api/search-favorites', FaveController.searchFave);

module.exports = app;
