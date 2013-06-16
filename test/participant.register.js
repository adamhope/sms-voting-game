var should = require("should"),
  Participant = require("../models/participant"),
  ApplicationError = require('../models/application_error');


describe('Participant', function() {
  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    var phoneNumberFrom = '041213852',
        anotherNumberFrom = '0422222222',
        username = "Hodor";

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

      it('troncates username', function(done) {
        var phoneNumberFrom = '041213852';
        var username = "1234567890123456789012345";
        Participant.register(phoneNumberFrom, username, function(err, p) {
          if (err) return done(err);
          p.username.should.equal('12345678901234567890');
          done();
        });
      });
    });

    describe('already registered', function() {
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

    describe('username already taken', function() {
      it('returns an error', function(done) {
        Participant.register(phoneNumberFrom, username, function(err, p1) {
          Participant.register(anotherNumberFrom, username, function(err, p2) {
            err.should.be.an.instanceof(ApplicationError.UsernameTaken);
            done();
          });
        });
      });

      it('does not add a new the participant', function(done) {
        Participant.register(phoneNumberFrom, username, function(err, p1) {
          Participant.register(anotherNumberFrom, username, function(err, p2) {
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
