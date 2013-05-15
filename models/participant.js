var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var participantSchema = mongoose.Schema({
  pin:         { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  votedForBy:  { }
});

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
