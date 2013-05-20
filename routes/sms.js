var Participant = require('../models/participant');

exports.handle = function(req, res) {
  var phoneNumberFrom = req.query["mobile"];
  var pinTo = req.query["response"].split("TW ")[1];
  Participant.connect(phoneNumberFrom, pinTo, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};
