const Fave = require('../models/fave.js');
const jwt = require('jsonwebtoken');
const token = require('./jwt_controller.js');

//UPDATES FAVORITE STAR
exports.updateFave = async (req, res) => {
  const { docID, Notes, access } = req.body;

  if (token.checkExpiry(access)) {
    return res.status(422).send({ message: "JWT expired" }); // return to login page
  }

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
  const { displayId, starId, notes, access } = req.body;

  if (token.checkExpiry(jwt)) {
    return res.status(422).send({ message: "JWT expired"}) // return to login page
  }

  const ud = jwt.verify(access, process.env.ACCESS_TOKEN);
  var id = ud.payload.ID;

    let duplicates = await Fave.find({starId, id})
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
      userId: id,
      notes: notes
  });

  try {
    const newFave = await fave.save();
    res.status(200).json(newFave);
  } catch (err) {
      response.status(500).send(error);
  }
}

// Delete Favorite Star
exports.deleteFave = async (req, res) => {
  const { starID, access } = req.body;

  if (token.checkExpiry(access)) {
    return res.status(422).send({ message: "JWT expired"}); // return to login page
  }

  try {   
    const favorite = await Fave.findByIdAndDelete(starID);
    if (!favorite) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
}

// Search Favorite Star
exports.searchFave = async (req, res) => {
  const { displayId, access } = req.body;

  if (token.checkExpiry(access)) {
    return res.status(422).send({ message: "JWT expired"}) // return to login page
  }

  const ud = jwt.verify(access, process.env.ACCESS_TOKEN);
  var id = ud.payload.ID;

  const search = displayId;
  const regex = new RegExp(search, 'i'); // i for case insensitive
  
  let Favorites = await Fave.find({displayId: {$regex: regex}, id});
  if (!Favorites) response.status(404).send("No item found");

  try {
    res.status(200).json(Favorites);
  } catch (err) {
      response.status(500).send(error);
  }
}


