var Participant = require('../models/participant'),
  http = require('http');

function extract(req) {
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"].toLowerCase()
  }
};

function vote(res, options) {
  Participant.vote(options.phoneNumber, options.text, function(err) {
    console.error(err);
  });
  res.send(201);
};

function register(res, options) {
  Participant.register(options.phoneNumber, options.text, function(err, participant) {
    if (err) {
      console.error(err);
    } else {
      //send sms
    }
  });
  res.send(201);

};

exports.sendSms = function(message, recipientNumber, smsSettings) {
  var url = exports.buildSendSmsUrl(message, recipientNumber, smsSettings);
  http.get(url).on('error', function(err) {
    console.log(err);
  });
};

function isNumberOnly(text) {
  return !!(/^\d+$/.exec(text));
};

exports.buildSendSmsUrl = function(message, recipientNumber, smsSettings) {
  return smsSettings.url + "messages.single?" + 
  "apikey=" + smsSettings.key + "&" +
  "apisecret=" + smsSettings.secret + "&" +
  "mobile=" + recipientNumber + "&" +
  "message=" + message.split(" ").join("+") + "&" +
  "caller_id=" + "thoughtworks";
};

exports.dispatch = function(req, res) {
  var options = extract(req);
  if (isNumberOnly(options.text)) {
    vote(res, options);
  } else {
    register(res, options);
  }
};

