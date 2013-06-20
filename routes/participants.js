var Participant = require('../models/participant'),
  _ = require('underscore');

exports.list = function(req, res) {
  Participant.find(function(err, participants) {
    res.render('participants/index', {
      title: 'Participant',
      participants: participants,
      bodyClass: 'play'
    });
  });
};

// TODO: needs tests
exports.json = function(req, res) {
  var NUMBER_OF_USERS = 10;
  Participant.find(function(err, participants) {

    var sorted = _.map(_.first(_.sortBy(participants, function(p) {return p.score * -1;}), NUMBER_OF_USERS), function(p){
      return {username: p.username, score: p.score};
    });

    res.json(sorted);
  });
};

exports.links = function (req, res) {
  Participant.find(function(err, participants) {

    var nodes  = [],
        links  = [],
        nodeIds = [],
        linkCount = 0,
        nodeCount = 0,
        donationPerVote = 4,
        totalDonation = 0,
        donationLimit    = 2000;

  for (var i = 0; i < participants.length; i ++) {
    nodeIds.push(participants[i].phoneNumber);
  }

  for (var i = 0; i < participants.length; i ++) {
      var p      = participants[i],
          nodeId = p.phoneNumber,
          voters = p.votedForBy,
          name   = p.username,
          size   = p.score;

      nodes.push({
        id: nodeId,
        name: name,
        size: size
      });

      for (var voter in voters) {
        if (voters.hasOwnProperty(voter)) {
          if (_.contains(nodeIds, voter)) {
            totalDonation += donationPerVote;
            linkCount++;

            links.push({
              source: voter,
              target: nodeId
            });
          }
        }
      }
    }

    res.json({
      nodes: nodes,
      links: links,
      totalDonation: totalDonation > donationLimit ? donationLimit : totalDonation,
      // NOTE these are quick hacks to make up for the fact that we are constantly polling the server instead of using socket.io
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
    if (err) console.error(err);
  });
  res.redirect('participants');
};

exports.delete = function(req, res) {
  Participant.remove({}, function(err) {
    if (err) {console.log(err);}
    res.redirect('participants');
  });
}
