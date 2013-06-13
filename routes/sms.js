var Participant = require('../models/participant'),
  http = require('http'),
  settings = require('../settings'),
  ApplicationError = require('../models/application_error'),
  smsEnabled = false,
  _ = require('underscore');

function extract(req) {
  smsEnabled = !!!(/disabled/.exec(req.query['sms']));
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"]
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

var timer,
  timeInMinutes;

exports.index = function(req, res) {
  var message;
  if (timeInMinutes) {
    message = 'A timer has been set to broadcast every ' + timeInMinutes + ' minutes.';
  } else {
    message = 'No timer has been set so far.'
  }
  res.render('sms/index', {broadcastingMessage: message});
}

exports.startBroadcast = function(req, res) {
  timeInMinutes = Number(req.body['minutes']);
  if (timeInMinutes) {
    setBroadcasting(timeInMinutes * 1000 * 60);
    res.redirect('/sms');
  } else {
    timeInMinutes = null;
    res.send(400, req.body['minutes'] + ' is not a number');
  }
}

exports.stopBroadcast = function(req, res) {
  clearInterval(timer);
  timeInMinutes = null;
  res.redirect('/sms');
}

function setBroadcasting(ms) {
  timer = setInterval(function(){
    Participant.rank(function(err, participants){
      if (err) {
        console.log(err);
        return;
      }
      
      _.each(participants, function(p, index) {
        var message = p.username + ' you are in ' + (index+1) + ' th place with ' + p.score + ' votes.';
        console.log(message);
        // exports.sendSms(message, p.phoneNumber, settings.burstApi);
      });
    });
  }, ms);
}

