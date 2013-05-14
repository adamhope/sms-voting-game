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

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
