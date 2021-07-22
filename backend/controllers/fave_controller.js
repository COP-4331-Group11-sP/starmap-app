const Fave = require('../models/fave.js');

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