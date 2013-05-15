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
    console.log(arguments);
    var query = Participant.findOne({pin: pinTo});
    query.exec(function(err, participant) {
      if (err) return errorHandler(err);
      console.log(participant);

      Participant.findById(participant.id, function(err, p){
        if (err) return errorHandler(err);
        p.votedForBy[phoneNumberFrom] = null;
        p.save(function(err){
          if (err) return errorHandler(err);
          console.log(participant);
        });
      });
    });
};
