var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var participantSchema = mongoose.Schema({
  pin: String,
  phoneNumber: String,
  votes: {
    phoneNumber: String
  }
});

var p = new Participant({
  pin: "1234",
  phoneNumber: "0414213852",
  votes: {
    phoneNumber: "0404882585"
  }
});

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
