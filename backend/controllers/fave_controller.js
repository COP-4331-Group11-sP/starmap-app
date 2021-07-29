const Fave = require('../models/fave.js');

//UPDATES FAVORITE STAR
exports.updateFave = async (req, res) => {
  const { docID, Notes } = req.body;

  try {
    await Fave.findByIdAndUpdate({ _id : docID }, { notes : Notes });
    return res.status(200).send({
      message: "Updated notes"
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

//ADDS FAVORITE STAR
exports.addFave = async (req, res) => {
  const { displayId, starId, userId, notes } = req.body;

  let duplicates = await Fave.find({starId, userId})
  duplicates = duplicates.length;

  // prevents duplicate starId
  if (duplicates > 0)
  {
      res.status(401).send(
        {
          message: 'duplicate found'
        });
      return;
  };
  
  const fave = new Fave({
      displayId: displayId,
      starId: starId,
      userId: userId,
      notes: notes
  })

  try {
    const newFave = await fave.save()
    res.status(200).json(newFave)
  } catch (err) {
      response.status(500).send(error);
  }
}

// Delete Favorite Star
exports.deleteFave = async (request, response) => {
  try {
    const { displayId, userId } = req.body;
    const favorite = await Fave.findOneAndDelete({starId, userId});
    if (!favorite) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
}

// Search Favorite Star
exports.searchFave = async (req, res) => {
  const { displayId, userId } = req.body;
  const search = displayId
  const regex = new RegExp(search, 'i') // i for case insensitive
  
  let Favorites = await Fave.find({displayId: {$regex: regex}, userId})
  if (!Favorites) response.status(404).send("No item found");

  try {
    res.status(200).json(Favorites)
  } catch (err) {
      response.status(500).send(error);
  }
  }


