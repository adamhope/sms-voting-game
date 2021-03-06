var mongoose = require('mongoose'),
  Participant = require('../models/participant'),
  should = require('should'),
  ApplicationError = require('../models/application_error');

describe("Participant", function(){
  describe("#vote", function(){
    var participant = null,
      anotherParticipant = null;

    beforeEach(function(done){
      participant = new Participant({pin: '00001', username: "Hodor", phoneNumber: '0400111100', votedForBy: {}});
      participant.save(function(err){
        if (err) return done(err);
        anotherParticipant = new Participant({pin: '99991', username: "Hodor2", phoneNumber: '0499999999', votedForBy: {}});
        anotherParticipant.save(done);
      });
    });

    afterEach(function(done){
      Participant.remove({}, done);
    });

    it('adds the phoneNumber of the registered participant', function(done){
      Participant.vote(anotherParticipant.phoneNumber, participant.pin, function(err, p){
        if (err) return done(err);
        p.votedForBy.should.have.property(anotherParticipant.phoneNumber);
        done();
      });
    });

    it('disallows vote when the voter is not registered', function(done) {
      Participant.vote('0412121212', participant.pin, function(err, p){
        err.should.be.an.instanceof(ApplicationError.RegistrationNeeded);
        done();
      });
    });

    it('returns invalid pin error when no registered participant has the pin code', function(done) {
      Participant.vote(anotherParticipant.phoneNumber, '10101', function(err, p){
        err.should.be.an.instanceof(ApplicationError.InvalidPin);
        done();
      });
    });
  });
});
