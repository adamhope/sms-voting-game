Participant = require('./models/participant');

var seed = function() {
  Participant.find(function(err, participants) {
    if (participants.length === 0) {
      new Participant({
        pin: "00000",
        username: "Dominic",
        phoneNumber: "0414213852",
        votedForBy: {
          '0414213852': null
        }
      }).save();
      new Participant({
        pin: "00001",
        username: "Hodor",
        phoneNumber: "0414213333",
        votedForBy: {
          '0414213333': null,
          '0414213852': null
        }
      }).save();
      new Participant({
        pin: "00003",
        username: "Adam",
        phoneNumber: "0414214444",
        votedForBy: {
          '0414214444': null,
          '0414213852': null,
          '0414213333': null
        }
      }).save();
      new Participant({
        pin: "00004",
        username: "Fred",
        phoneNumber: "0414215555",
        votedForBy: {
          '0414215555': null
        }
      }).save();
    }
  });
};

module.exports = seed;
