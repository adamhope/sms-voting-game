var mongoose = require('mongoose'),
  Participant = require('../models/participant');

mongoose.connect('mongodb://localhost/sms-voting-game-test');

describe("Participant", function(){
  describe("#connect", function(){
    var participant = null;

    beforeEach(function(done){
      participant = new Participant({pin: '00001', votedForBy: {}});
      participant.save(done);
    });

    afterEach(function(done){
      Participant.remove({}, done);
    });
    
    it('adds the phoneNumber', function(done){
      var phoneNumberFrom = '0412121212';
      Participant.connect(phoneNumberFrom, participant.pin, function(err, p){
        if (err) return done(err);
        p.votedForBy.should.have.property(phoneNumberFrom);
        done();
      });
    });  
  });
});
