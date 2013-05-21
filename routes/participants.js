var Participant = require('../models/participant');

exports.list = function(req, res) {
  Participant.find(function(err, participants) {
    res.render('participants/index', {
      title: 'Participant',
      participants: participants
    });
  });
};

exports.json = function(req, res) {
  Participant.find(function(err, participants) {

    var scoreData = {
      participants: [],
      scores: []
    };

    var i = participants.length;

    while (i--) {
      scoreData.participants.push(participants[i].phoneNumber);
      scoreData.scores.push(participants[i].score);
    }

    res.json({ scoreData: scoreData });
  });
};

exports.create = function(req, res) {
  var phoneNumber = req.body['phone-number'];

  Participant.register(phoneNumber, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};

exports.vote = function(req, res) {
  var phoneNumberFrom = req.body['phone-number-from'],
      pinTo = req.body['pin-number-to'];
  Participant.vote(phoneNumberFrom, pinTo, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};
