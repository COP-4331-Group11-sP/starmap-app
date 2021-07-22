const express = require('express');
const faveModel = require('../models/fave');
const app = express();

app.post('/API/add-favorites', async (request, response) => {
    const favorite = new faveModel(request.body);

    let duplicates = await faveModel.find({starId: request.body.starId, userId: request.body.userId});
    duplicates = duplicates.length;
    
    // prevents duplicate starId
    if (duplicates > 0)
    {
        response.status(401).send('duplicate found');
        return;
    };

    try {
        await favorite.save();
        response.send(favorite);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;
