const express = require('express');
const faveModel = require('../models/fave');
const FaveController = require('../controllers/fave_controller.js');
const app = express();

app.post('/create-favorites', async (request, response) => {
    const favorite = new faveModel(request.body);

    try {
        await favorite.save();
        response.send(favorite);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post('/update-favorite', FaveController.updateFave);


module.exports = app;
