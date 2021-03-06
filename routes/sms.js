var Participant = require('../models/participant'),
  http = require('http'),
  settings = require('../settings'),
  ApplicationError = require('../models/application_error'),
  smsEnabled = false,
  _ = require('underscore')
  async = require('async');

function extract(req) {
  smsEnabled = !!!(/disabled/.exec(req.query['sms']));
  return {
    phoneNumber: req.query["mobile"],
    text: req.query["response"]
  };
}

function register(res, options) {
  Participant.register(options.phoneNumber, options.text, function(err, participant) {
    var message;
    async.series([
      function(nextSerie) {
        if (err) {
          if (err instanceof ApplicationError.AlreadyRegistered) {
            Participant.findOne({phoneNumber: options.phoneNumber}, function(err, participant) {
              message = participant.username + ', you are already registered and your PIN is ' + participant.pin;
              nextSerie();
            });
          } else if(err instanceof ApplicationError.UsernameTaken) {
            message = 'Sorry, ' + options.text + ' is already taken. Please try a different username.';
            nextSerie();
          } else {
            console.log(err);
            message = 'Sorry something went wrong. Please try again.';
            nextSerie();
          }
        } else {
          message = participant.username + ', thank you for registering. Your PIN is ' + participant.pin;
          nextSerie();
        }

      }], function() {
        exports.sendSms(message, options.phoneNumber, settings.burstApi);
        res.send(201);
    });
  });
};

function vote(res, options) {
  Participant.vote(options.phoneNumber, options.text, function(err, participant) {
    var message;
    if (err) {
      if (err instanceof ApplicationError.InvalidPin) {
        message = 'Sorry, I can\'t find a user with PIN '+ options.text + '.';
      } else if (err instanceof ApplicationError.RegistrationNeeded) {
        message = "Sorry, you must register before connecting. SMS your full name to register";
      } else {
        message = 'Sorry something went wrong. Please try again.';
      }
    } else {
      message = 'Thanks for connecting with ' + participant.username;
    }
    exports.sendSms(message, options.phoneNumber, settings.burstApi);
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
  timeInMinutes,
  dateTimerSet;

exports.index = function(req, res) {
  var message;
  if (timeInMinutes) {
    message = '[' + dateTimerSet.getHours() + ':' + dateTimerSet.getMinutes() + '] A timer has been set to broadcast every ' + timeInMinutes + ' minutes.';
  } else {
    message = 'No timer has been set.'
  }
  res.render('sms/index', {broadcastingMessage: message, bodyClass: 'sms', title: 'broadcast sms'});
}

exports.startBroadcast = function(req, res) {
  clearInterval(timer);
  dateTimerSet = new Date(Date.now());
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

var suffix = function (n) {
  n = n % 10;
  return n > 3 ? 'th' : ['th', 'st', 'nd', 'rd'][n];
};

function setBroadcasting(ms) {
  timer = setInterval(function(){
    Participant.rank(function(err, participants){
      if (err) {
        console.log(err);
        return;
      }

      if (participants.length >= 1) {
        var topScore = _.first(participants).score,
          message,
          leads = _.filter(participants, function(p) {return p.score == topScore});

        if (leads.length == 1) {
          message = _.first(leads).username + ', you are in the lead!';
          exports.sendSms(message, _.first(leads).phoneNumber, settings.burstApi);
          participants = _.rest(participants);
        }

        _.each(participants, function(p) {
          var nConnections = (topScore - p.score + 1) > 1 ? (topScore - p.score + 1) + ' connections' : (topScore - p.score + 1) + ' connection';
          message = p.username + ', you are ' + nConnections + ' away from the lead.'
          exports.sendSms(message, p.phoneNumber, settings.burstApi);
        });
      }
    });
  }, ms);
}

