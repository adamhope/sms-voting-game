var Participant = require('../models/participant'),
  mongoose = require('mongoose'),
  backgrounder = require("backgrounder"),
  async = require('async'),
  _ = require('underscore');

var database = 'mongodb://localhost/sms-voting-game-test',
  NB_WORKERS = 2,
  NB_REGISTRATIONS_PER_WORKER = 10,
  NB_VOTES_PER_WORKER = 100;

mongoose.connect(database);

Participant.remove({}, function(err) {
  async.each(initWorkers(), function(worker, callback) {
    worker.process.send(worker.message, function() {
      worker.process.terminate();
      callback();
    });
  }, function(err) {
    console.log('It is done!!')
    mongoose.disconnect();
  });

  function initWorkers() {
    var workers = [];
    _(NB_WORKERS).times(function(nWorker) {
      workers.push({
        process: backgrounder.spawn(__dirname + "/worker.js"),
        message: (function() {
          var message = [];
          _(NB_REGISTRATIONS_PER_WORKER).times(function(nRegistration) {
            message.push([nWorker + '00' + nRegistration, nWorker + 'username' + nRegistration]);
          });
          return message;
        })()
      });
    });
    return workers;
  }
});