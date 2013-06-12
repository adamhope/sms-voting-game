var Participant = require('./models/participant'),
    Faker       = require('Faker');

// var seed = function() {
//   Participant.find(function(err, participants) {
//     if (participants.length === 0) {
//       new Participant({
//         pin: "00000",
//         username: "Dominic",
//         phoneNumber: "0414213852",
//         votedForBy: {
//           '0414213852': null
//         }
//       }).save();
//       new Participant({
//         pin: "00001",
//         username: "Hodor",
//         phoneNumber: "0414213333",
//         votedForBy: {
//           '0414213333': null,
//           '0414213852': null
//         }
//       }).save();
//       new Participant({
//         pin: "00003",
//         username: "Adam",
//         phoneNumber: "0414214444",
//         votedForBy: {
//           '0414214444': null,
//           '0414213852': null,
//           '0414213333': null
//         }
//       }).save();
//       new Participant({
//         pin: "00004",
//         username: "Fred",
//         phoneNumber: "0414215555",
//         votedForBy: {
//           '0414215555': null
//         }
//       }).save();
//     }
//   });
// };

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

var seedMore = function() {
  Participant.find(function(err, participants) {
    //if (paricipants.length === 0) {
      var NUMBER_OF_PARTICIPANTS = 300;
      var MAX_NUMBER_OF_CONNECTIONS = 3;
      var unconnected_participants = [];

      for(var i = 0; i < NUMBER_OF_PARTICIPANTS; i++) {
        var ph = Faker.PhoneNumber.phoneNumberFormat(6);
        //console.log(ph);
        var p = new Participant({
          //pin: zeroPad(i, 5),
          username: Faker.Internet.userName(),
          phoneNumber: ph,
        });   
        p.votedForBy = {};
        p.votedForBy[ph] = null;
        unconnected_participants.push(p);
      }

      for(var i = 0; i < NUMBER_OF_PARTICIPANTS; i++) {
        var p = unconnected_participants[i];
        var how_many_connections = Math.floor(Math.random() * MAX_NUMBER_OF_CONNECTIONS) + 1;
        for (var j = 0; j < how_many_connections; j++) {
          var voter_index = Math.floor(Math.random() * unconnected_participants.length) + 1
          var voter = unconnected_participants[voter_index - 1];
          p.votedForBy[voter.phoneNumber] = null;
        }
        p.save();
      }
    //}
  });
};

// module.exports = seed;
module.exports = seedMore;
