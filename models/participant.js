var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var participantSchema = mongoose.Schema({
  pin: String,
  phonenumber: String,
  votes: Number
});

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
