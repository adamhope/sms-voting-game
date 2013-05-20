var Participant = require('./participant');

exports.dispatch = function(phoneNumber, keyword, text) {
  console.log(keyword);
  switch (keyword) {
    case 'register':
      Participant.register(phoneNumber, function(){});
      break;
    case 'vote':

      break;
    default:

      break;
  }
};
