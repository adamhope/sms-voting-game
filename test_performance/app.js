var Participant = require('../models/participant'),
  mongoose = require('mongoose'),
  backgrounder = require("backgrounder"),
  async = require('async');

var database = 'mongodb://localhost/sms-voting-game-test';
mongoose.connect(database);

Participant.remove({}, function(err) {
  
  var workers = initWorkers();
  async.each(workers, function(worker, callback) {
    worker.process.send(worker.message, function() {
      worker.process.terminate();
      callback();
    });
  }, function(err){
    console.log('It is done!!')
    mongoose.disconnect();
  });

  function initWorkers() {
    var workers = [];
    workers.push({process: backgrounder.spawn(__dirname + "/worker.js"), message: [['000', 'a000'], ['001', 'a001']]});
    workers.push({process: backgrounder.spawn(__dirname + "/worker.js"), message: [['003', 'a003'], ['004', 'a004']]});

    return workers;
  }
});