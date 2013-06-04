var should = require("should"),
  Participant = require("../models/participant"),
  ApplicationError = require('../models/application_error');


describe('Participant', function() {
  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    describe('not registered yet', function(){
      it('adds a new participant to the database', function(done) {
        var phoneNumberFrom = '041213852';
        var username = "HodorHodor";
        Participant.register(phoneNumberFrom, username, function(err, p) {
          if (err) return done(err);
          p.phoneNumber.should.equal(phoneNumberFrom);
          p.username.should.equal(username);
          p.score.should.equal(1);
          done();
        });
      });
    });


    describe('already registered', function() {
      var phoneNumberFrom = '041213852',
        username = "Hodor";

      it('returns already registered error', function(done) {
        Participant.register(phoneNumberFrom, username, function(err, p1) {
          
          Participant.register(phoneNumberFrom, username, function(err, p2) {
            err.should.be.an.instanceof(ApplicationError.AlreadyRegistered);
            done();
          });
        });
      });

      it('does not add a new the participant', function(done) {
        Participant.register(phoneNumberFrom, username, function(err, p1) {
          Participant.register(phoneNumberFrom, username, function(err, p2) {
            Participant.count({}, function(err, count){
              count.should.equal(1);
              done();
            });
          });
        });
      });

    });
  });
});
