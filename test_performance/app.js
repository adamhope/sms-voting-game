var Participant = require('../models/participant'),
  mongoose = require('mongoose'),
  backgrounder = require("backgrounder"),
  async = require('async');

var database = 'mongodb://localhost/sms-voting-game-test';
mongoose.connect(database);

Participant.remove({}, function(err) {
  
  var workers = [backgrounder.spawn(__dirname + "/worker.js"), backgrounder.spawn(__dirname + "/worker.js")];

  async.each(workers, function(worker, callback) {
    worker.send({}, function() {
      worker.terminate()
      callback();
    });
  }, function(err){
    console.log('It is done!!')
    mongoose.disconnect();
  });

});