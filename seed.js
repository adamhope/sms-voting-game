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
          '0041421333': null
        }
      }).save();
    }
  });
};

module.exports = seed;
