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

participantSchema.pre('validate', function(next) {
  that = this;
  if (!this.pin) {
    createUniquePin(function(err, uniquePin) {
      if (err) {
        next(err);
      } else {
        that.pin = uniquePin;
        next();
      }
    });
  } else {
    next();
  }
});

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
    username: username,
    votedForBy: {}
  });
  p.votedForBy[phoneNumber] = null;
  p.save(callback);
}

var Participant = mongoose.model('Participant', participantSchema); 
module.exports = Participant;
