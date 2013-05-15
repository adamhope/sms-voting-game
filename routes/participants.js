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
  var p = new Participant({
    phoneNumber: req.body.phoneNumber,
    votedForBy: { }
  });
  p.votedForBy[req.body.phoneNumber] = null;
  p.save(function (err) {
    console.error(err); //duplicate phnumber
  });
  res.redirect('participants');
};
