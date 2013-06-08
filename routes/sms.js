var Participant = require('../models/participant'),
  http = require('http'),
  settings = require('../settings'),
  ApplicationError = require('../models/application_error'),
  smsEnabled = false;

function extract(req) {
  smsEnabled = !!!(/disabled/.exec(req.query['sms']));
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"].toLowerCase()
  }
};

function register(res, options) {
  Participant.register(options.phoneNumber, options.text, function(err, participant) {
    if (err) {
      if (err instanceof ApplicationError.AlreadyRegistered) {
        exports.sendSms('You are already registered. Your PIN is ' + participant.pin, options.phoneNumber, settings.burstApi);
      } else if(err instanceof ApplicationError.UsernameTaken) {
        exports.sendSms('Username already taken', options.phoneNumber, settings.burstApi);
      } else {
        console.log(err);
      }
    } else {
      exports.sendSms('Thank you for registering. Your PIN is ' + participant.pin, participant.phoneNumber, settings.burstApi);
    }
    res.send(201);
  });
};

function vote(res, options) {
  Participant.vote(options.phoneNumber, options.text, function(err, participant) {
    var message;
    if (err) {
      if (err instanceof ApplicationError.InvalidPin) {
        message = 'User with pin '+ options.text + ' not found';
        exports.sendSms(message, options.phoneNumber, settings.burstApi);
      } else {
        console.log(err);
      }
    } else {
      message = 'Thank you for voting to ' + participant.pin;
      exports.sendSms(message, options.phoneNumber, settings.burstApi);
    }
    res.send(201);
  });
};

exports.sendSms = function(message, recipientNumber, smsSettings) {
  if (smsEnabled) {
    var url = exports.buildSendSmsUrl(message, recipientNumber, smsSettings);
    http.get(url).on('error', function(err) {
      console.log(err);
    });
  }
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
  "caller_id=" + smsSettings.callerId;
};

exports.dispatch = function(req, res) {
  var options = extract(req);
  if (isNumberOnly(options.text)) {
    vote(res, options);
  } else {
    register(res, options);
  }
};

