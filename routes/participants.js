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
      scores: [],
      totalScore: 0
    };

    var i = participants.length;

    while (i--) {
      scoreData.participants.push(participants[i].phoneNumber);
      scoreData.scores.push(participants[i].score);
    }

    scoreData.scores.map(function(s){
      scoreData.totalScore += s;
    });

    res.json({ scoreData: scoreData });
  });
};

exports.links = function (req, res) {
  Participant.find(function(err, participants) {

    // input
    // { pin: '0001',
    //   phoneNumber: '0414213333',
    //   votedForBy: { '0404882585': null, '0404882583': null },
    //   _id: 519243574325122724000002,
    //   __v: 0
    // }

    // output
    // {source: "Microsoft", target: "Amazon", type: "licensing"},

    var target = this.phoneNumber,
        links  = [],
        i      = participants.length;

    // loop over particpants
    while (i--) {

      // loop over phone numbers
      var voters = participants[i].votedForBy,
          target = participants[i].phoneNumber;

      for (var voter in voters) {
        if (voters.hasOwnProperty(voter)) {

          links.push({
            source: voter,
            target: target,
            type  : 'licensing'
          });

        }
      }

    }

    res.json({ links: links });

  });
};

exports.create = function(req, res) {
  var phoneNumber = req.body['phone-number'];
  var username = req.body['username'];

  Participant.register(phoneNumber, username, function(err) {
    if (err) console.error(err);
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
