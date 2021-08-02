const Fave = require('../models/fave.js');

//UPDATES FAVORITE STAR
exports.updateFave = async (req, res) => {
  const { starId, userId, displayId, notes} = req.body;
  let favorite = await Fave.findOneAndUpdate({starId, userId}, {displayId: displayId, notes: notes});
  if (!favorite) res.status(404).send("No item found");
  try {
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
}

//ADDS FAVORITE STAR
exports.addFave = async (req, res) => {
  const { displayId, starId, userId } = req.body;

  let duplicates = await Fave.find({starId, userId})
  duplicates = duplicates.length;

  // prevents duplicate starId
  if (duplicates > 0)
  {
      res.status(401).send( { message: 'duplicate found' } );
      return;
  }
  
  const fave = new Fave({
    displayId: displayId,
    starId: starId,
    userId: userId,
    notes: ''
  });

  try {
    const newFave = await fave.save();
    res.status(200).json(newFave);
  } catch (err) {
    res.status(500).send(error);
  }
}

// Delete Favorite Star
exports.deleteFave = async (req, res) => {
  const { starId, userId} = req.body;
  let favorite = await Fave.findOneAndDelete({starId, userId});
  if (!favorite) res.status(404).send("No item found");
  try {
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
}

// Search Favorite Star
exports.searchFave = async (req, res) => {
  const { starId, userId } = req.body;
  const regex = new RegExp(starId, 'i'); // i for case insensitive
  
  let favorites = await Fave.find({starId: {$regex: regex}, userId});
  if (!favorites) res.status(404).send("No item found");

  try {
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).send(error);
  }
}