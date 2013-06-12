var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  ApplicationError = require('./application_error');

var participantSchema = mongoose.Schema({
  pin:         { type: String, unique: true },
  username:    { type: String, unique: true }, 
  phoneNumber: { type: String, unique: true },
  score: {type: Number, default: "1"},
  votedForBy:  { }
});

//Hook for creation of random pin number.
//Can still override it by explicitly creating model with pin
participantSchema.path('phoneNumber').set(function (v) {
  this.pin = Math.random().toString().substr(2, 4);
  return v;
});

participantSchema.statics.register = function (phoneNumber, username, callback) {
  Participant.findOne({phoneNumber: phoneNumber}, function(err, p) {
    if (err) return callback(err);
    if (p) {
      callback(new ApplicationError.AlreadyRegistered(), p);
    } else {
      Participant.findOne({username: username}, function(err, p) {
        if (err) return callback(err);
        if (p) {
          callback(new ApplicationError.UsernameTaken(), p);
        } else {
          createParticipant(phoneNumber, username, callback);
        }
      });
    }
  });
};

participantSchema.statics.vote = function(phoneNumberFrom, pinTo, callback) {
  Participant.findOne({pin: pinTo}, function(err, participant) {
    var set = {};
    if (err) return callback(err);
    if (participant === null) return callback(new ApplicationError.InvalidPin());

    set['votedForBy.' + phoneNumberFrom] = null;
    set['score'] = participant.score + 1;
    Participant.findByIdAndUpdate(participant.id, { $set: set}, callback);
  });
};

participantSchema.statics.rank = function(callback) {
  var query = Participant.find({}).sort({score: 'desc'}).exec(callback);
};

function createParticipant(phoneNumber, username, callback) {
  var p = new Participant({
    phoneNumber: phoneNumber,
    username: username,
    votedForBy: {}
  });
  p.votedForBy[phoneNumber] = null;
  p.save(callback);
}

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
