var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var participantSchema = mongoose.Schema({
  pin:         { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  votedForBy:  { }
});

//Hook for creation of random pin number.
//Can still override it by explicitly creating model with pin
participantSchema.path('phoneNumber').set(function (v) {
  this.pin = Math.random().toString().substr(2, 4);
  return v;
});

participantSchema.virtual('score').get(function () {
  var count = 0;
  for (var prop in this.votedForBy) {
    if (this.votedForBy.hasOwnProperty(prop)) { ++ count; }
  }
  return count;
});

participantSchema.statics.register = function (phoneNumber, callback) {
  Participant.findOne({phoneNumber: phoneNumber}, function(err, p) {
    if (err) return callback(err);
    if (p) {
      callback(null, p);
    } else {
      createParticipant(phoneNumber, callback);
    }
  });
};

participantSchema.statics.vote = function(phoneNumberFrom, pinTo, callback) {
  Participant.findOne({pin: pinTo}, function(err, participant) {
    var set = {};
    if (err) return callback(err);
    if (participant === null) return callback(new Error('No participant has pin code ' + pinTo));

    set['votedForBy.' + phoneNumberFrom] = null;
    Participant.findByIdAndUpdate(participant.id, { $set: set}, callback);
  });
};

function createParticipant(phoneNumber, callback) {
  var p = new Participant({
    phoneNumber: phoneNumber,
    votedForBy: {}
  });
  p.votedForBy[phoneNumber] = null;
  p.save(callback);
}

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
