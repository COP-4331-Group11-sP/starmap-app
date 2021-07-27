const express = require('express');
const faveModel = require('../models/fave');
const app = express();

app.delete('/API/delete-favorites', async (request, response) => {
  try {
    
    const favorite = await faveModel.findByIdAndDelete(request.query.id);
    
    if (!favorite) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;