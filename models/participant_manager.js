var Participant = require('./participant');

exports.register = function(phoneNumber, errorHandler) {
  var p = new Participant({
    phoneNumber: phoneNumber,
    votedForBy: {}
  });
  p.votedForBy[phoneNumber] = null;
  p.save(function (err) {
    return errorHandler(err);
  });
}

exports.connect = function(phoneNumberFrom, pinTo, callback) {
  var query = Participant.findOne({pin: pinTo}),
      set = {};

  query.exec(function(err, participant) {
    if (err) return callback(err);
    set['votedForBy.' + phoneNumberFrom] = null;
    
    Participant.findByIdAndUpdate(participant.id, { $set: set}, function(err, p){
      if (err) return callback(err);
      return callback(null, p);
    });
  });
};
