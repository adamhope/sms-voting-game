var Participant = require('../models/participant');

exports.handle = function(req, res) {
  var phoneNumberFrom = req.query["mobile"];
  var pinTo = req.query["response"].split("TW ")[1];
  Participant.vote(phoneNumberFrom, pinTo, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};

exports.register = function(req, res) {
  Participant.register(this.extract(req).phoneNumber, function(err, participant) {
    if (err) console.log(err);
    // send sms with participant.pin
  });
};

exports.extract = function(req, keyword) {
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"].split(keyword + " ")[1]
  }
};
