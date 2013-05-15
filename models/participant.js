var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var participantSchema = mongoose.Schema({
  // TODO Enable unique for pin after generating it propertly
  // pin:         { type: String, unique: true },
  pin:         { type: String },
  phoneNumber: { type: String, unique: true },
  votedForBy:  { }
});

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
