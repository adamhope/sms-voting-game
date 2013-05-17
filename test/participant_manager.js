var mongoose = require('mongoose'),
  participantManager = require('../models/participant_manager'),
  Participant = require('../models/participant');

mongoose.connect('mongodb://localhost/sms-voting-game-test');

describe("ParticipantManager", function(){
  var participant = null;

  beforeEach(function(done){
    participant = new Participant({pin: '00001', votedForBy: {}});
    participant.save(done);
  });

  afterEach(function(done){
    Participant.remove({}, done);
  });

  describe("#connect", function(){
    it('adds the phoneNumber', function(done){
      var phoneNumberFrom = '0412121212';
      participantManager.connect(phoneNumberFrom, participant.pin, function(err, p){
        if (err) return done(err);
        p.votedForBy.should.have.property(phoneNumberFrom);
      });
      done();
    });  
  });
  
});
