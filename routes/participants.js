var Participant = require('../models/participant');
console.log(Participant);

exports.list = function(req, res) {
  Participant.Participant.find(function(err, participants) {
    res.render('participants/index', {
      title: 'Participant',
      participants: participants
    });
  });
};
