var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  ApplicationError = require('./application_error'),
  _ = require('underscore');

var participantSchema = mongoose.Schema({
  pin:         { type: String, unique: true, required: true },
  username:    { type: String, unique: true, required: true }, 
  phoneNumber: { type: String, unique: true, required: true },
  votedForBy:  { }
});

participantSchema.virtual('score').get(function () {
  var count = 0;
  for (var prop in this.votedForBy) {
    if (this.votedForBy.hasOwnProperty(prop)) { ++ count; }
  }
  return count;
});

participantSchema.statics.register = function (phoneNumber, username, callback) {
  Participant.findOne({phoneNumber: phoneNumber}, function(err, p) {
    if (err) return callback(err);
    if (p) {
      callback(new ApplicationError.AlreadyRegistered());
    } else {
      Participant.findOne({username: username}, function(err, p) {
        if (err) return callback(err);
        if (p) {
          callback(new ApplicationError.UsernameTaken());
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
    Participant.findByIdAndUpdate(participant.id, { $set: set}, callback);
  });
};

participantSchema.statics.rank = function(callback) {
  Participant.find({}, function(err, participants) {
    if (err) {return callback(err);}
    callback(null, _.sortBy(participants, function(p) {return p.score;}).reverse());
  });
};

function createParticipant(phoneNumber, username, callback) {
  var p = new Participant({
    phoneNumber: phoneNumber,
    username: username.substr(0, 20),
    votedForBy: {}
  });
  p.votedForBy[phoneNumber] = null;
  createUniquePin(function(err, pin) {
    if (err) return callback(err);
    p.pin = pin;
    p.save(callback);
  });
}

function createUniquePin(callback) {
  Participant.count(function(err, count) {
    if (err) {return callback(err);}
    callback(null, Number('' + _.random(10, 99) + pad(count,3)));
  });
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
