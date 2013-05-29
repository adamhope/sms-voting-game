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
    if (err) console.error(err);
    else {
      //send sms
    }
  });
  res.send(201);
};

exports.sendSMS = function(message, recipientNumber, apiSettings) {
  var url = this.buildSendSmsURL(message, recipientNumber, apiSettings);
  // http.get(url, function(res) {
  //   console.log(res);
  // }).on ("error", function(err) {
  //   console.log("ERRROROOROR");
  //   console.log(err);
  // });

  http.get("http://www.google.com/index.html", function(res) {
    console.log("Got response: " + res.statusCode);
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};




function isNumberOnly(text) {
  return !!(/^\d+$/.exec(text));
};


exports.buildSendSmsURL = function(message, recipientNumber, apiSettings) {
  return apiSettings.url + "messages.single?" + 
  "apikey=" + apiSettings.key + "&" +
  "apisecret=" + apiSettings.secret + "&" +
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

