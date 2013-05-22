var Participant = require('../models/participant');

exports.extract = function(req, keyword) {
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"].split(keyword + " ")[1]
  }
};

exports.vote = function(req, res) {
  var options = this.extract(req, 'VOTE');
  Participant.vote(options.phoneNumber, options.text, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};

exports.register = function(req, res) {
  Participant.register(this.extract(req, 'PIN').phoneNumber, function(err, participant) {
    if (err) console.log(err);
    // send sms with participant.pin
  });
};

