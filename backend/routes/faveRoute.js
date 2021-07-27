const express = require('express');
const faveModel = require('../models/fave');
const FaveController = require('../controllers/fave_controller.js');
const app = express();

app.post('/create-favorites', async (request, response) => {
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

app.post('/update-favorite', FaveController.updateFave);


module.exports = app;
