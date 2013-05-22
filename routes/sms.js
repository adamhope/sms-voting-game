var Participant = require('../models/participant');

function extract(req, keyword) {
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"].toLowerCase().split(keyword + " ")[1]
  }
};

function vote(res, options) {
  Participant.vote(options.phoneNumber, options.text, function(err) {
    console.error(err);
  });
  res.redirect('participants');
};

function register(res, options) {
  Participant.register(options.phoneNumber, function(err, participant) {
    if (err) console.log(err);
    res.redirect('participants');
  });
};

function isNumberOnly(text) {
  return !!(/^\d+$/.exec(text));
};

exports.dispatch = function(req, res) {
  var options = extract(req, 'tw');
  if (isNumberOnly(options.text)) {
    vote(res, options);
  } else {
    register(res, options)
  }
};

