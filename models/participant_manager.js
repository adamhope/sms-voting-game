var Participant = require('./participant');

exports.register = function(phoneNumber, errorHandler) {
  var p = new Participant({
    phoneNumber: phoneNumber,
    votedForBy: {phoneNumber: null}
  });
  p.save(function (err) {
    errorHandler(err);
  });
}

exports.connect = function(phoneNumberFrom, pinTo, errorHandler) {
    var query = Participant.findOne({pin: pinTo});
    query.exec(function(err, participant) {
    if (err) return errorHandler(err);
    console.log(participant);
  });
};

// TODO gerate pin randomly
function generatePin() {
  return 1234;
}
