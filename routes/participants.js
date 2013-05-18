var Participant = require('../models/participant');

exports.list = function(req, res) {
  Participant.find(function(err, participants) {
    res.render('participants/index', {
      title: 'Participant',
      participants: participants
    });
  });
};

exports.create = function(req, res) {
  var phoneNumber = req.body.phoneNumber;

  Participant.register(phoneNumber, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};

exports.connect = function(req, res) {
  var phoneNumberFrom = req.body.phoneNumberFrom,
      pinTo = req.body.pinNumberTo;
  Participant.connect(phoneNumberFrom, pinTo, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};
