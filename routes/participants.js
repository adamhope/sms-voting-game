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

    var nodes  = [],
        links  = [],
        i      = participants.length,
        linkCount = 0,
        nodeCount = 0,
        donationPerVote = 1,
        totalDonation = 0;

    while (i--) {

      nodeCount ++;

      var p      = participants[i],
          nodeId = p.phoneNumber,
          voters = p.votedForBy;

      nodes.push({
        id: nodeId
      });

      for (var voter in voters) {
        if (voters.hasOwnProperty(voter)) {

          totalDonation += donationPerVote;
          linkCount++;

          links.push({
            source: voter,
            target: nodeId
          });
        }
      }

    }

    res.json({
      nodes: nodes,
      links: links,
      totalDonation: totalDonation,
      // XXX these are quick hacks to make up for the fact that we are constantly polling the server instead of using socket.io
      nodeCount: nodeCount,
      linkCount: linkCount
    });

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
