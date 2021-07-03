const express = require('express');
const faveModel = require('../models/fave');
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


module.exports = app;