var should = require("should"),
  Participant = require("../models/participant"),
  ApplicationError = require('../models/application_error')
  async = require('async'),
  _ = require('underscore');


describe('Participant', function() {
  var participants = [];
  
  beforeEach(function(done) {    
    async.series([
      function(nextSerie) {
        Participant.remove({}, nextSerie);
      },

      function(nextSerie) {
        async.times(3, function(n, next) {
          Participant.register('04000' + n, 'username' + n, function(err, p){
            participants.push(p);
            next();
          });

        }, nextSerie);
      },

      function(nextSerie) {
        async.times(3, function(n, next){
          if (n == 1) { return next(); }
          Participant.vote(participants[n].phoneNumber, participants[1].pin, function(err, p) {
            if(err) {console.log(err);}
            next();
          });
        }, nextSerie);
      },

      function(nextSerie) {
        Participant.vote(participants[1].phoneNumber, participants[0].pin, nextSerie);
      }

    ], function() {
      done();
    });
  });

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#rank', function() {
    it('call the callback for all participant with their rank', function(done) {
      var expectedRank = 1,
        expectedParticipants = [participants[1].pin, participants[0].pin, participants[2].pin];

      Participant.rank(function(err, rankedParticipants) {
        _.map(rankedParticipants, function(p){return p.pin}).should.eql(expectedParticipants);
        done();
      });
    });
  });
});
