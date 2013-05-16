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

exports.connect = function(phoneNumberFrom, pinTo, errorHandler) {
  var query = Participant.findOne({pin: pinTo}),
      set = {};

  query.exec(function(err, participant) {
    console.log(participant);
    if (err) return errorHandler(err);
    set['votedForBy.' + phoneNumberFrom] = null;
    Participant.update({ _id: participant.id }, { $set: set}, function(err){
      if (err) return errorHandler(err);
      console.log(participant);
    });
  });
};
