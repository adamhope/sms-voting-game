var mongoose = require('mongoose'),
  Participant = require('../models/participant'),
  should = require('should');

mongoose.connect('mongodb://localhost/sms-voting-game-test');

describe("Participant", function(){
  describe("#connect", function(){
    var participant = null,
      anotherParticipant = null;

    beforeEach(function(done){
      participant = new Participant({pin: '00001', phoneNumber: '0400111100', votedForBy: {}});
      participant.save(function(err){
        if (err) return done(err);
        anotherParticipant = new Participant({pin: '99991', phoneNumber: '0499999999', votedForBy: {}});
        anotherParticipant.save(done);
      });
    });

    afterEach(function(done){
      Participant.remove({}, done);
    });
    
    it('adds the phoneNumber of the registered participant', function(done){
      Participant.connect(anotherParticipant.phoneNumber, participant.pin, function(err, p){
        if (err) return done(err);
        p.votedForBy.should.have.property(anotherParticipant.phoneNumber);
        done();
      });
    });

    it('does not allow to connect when no registered participant has the phone number', function(done) {
      Participant.connect('0412121212', participant.pin, function(err, p){
        err.message.should.match(/No participant has phone number/);
        done();
      });
    }); 

    it('does not allow to connect when no registered participant has the pin code', function(done) {
      Participant.connect(anotherParticipant.phoneNumber, '10101', function(err, p){
        err.message.should.match(/No participant has pin code/);
        done();
      });
    });
  });
});
