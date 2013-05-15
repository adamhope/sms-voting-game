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

//Hook for creation of random pin number.
//Can still override it by explicitly creating model with pin
participantSchema.path('phoneNumber').set(function (v) {
  this.pin = Math.random().toString(36).substr(2, 5);
  return v;
});

var Participant = mongoose.model('Participant', participantSchema); 

module.exports = Participant;
