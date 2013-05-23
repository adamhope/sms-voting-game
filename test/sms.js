var app = require('../app')
  , request = require('supertest')
  , express = require('express'),
  Participant = require('../models/participant'),
  sinon = require('sinon');

describe('SMS dispatch', function(){

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    it('respond with 201', function(done){
      var url = '/sms/?mobile=12345&response=TW+Username&message_id=0',
          stubParticipantRegister = sinon.stub(Participant, 'register');
      
      var afterRequest = function(err, res) {
        stubParticipantRegister.called.should.be.true;
        stubParticipantRegister.withArgs("12345").calledOnce.should.be.true;
        done();
      }; 

      request(app).get(url).expect(201, afterRequest);
    });
  });

  describe('#vote', function() {
    it('respond with 201', function(done){
      var url = '/sms/?mobile=12345&response=TW+9900&message_id=0',
          stubParticipantVote = sinon.stub(Participant, 'vote');
      
      var afterRequest = function(err, res) {
        stubParticipantVote.called.should.be.true;
        stubParticipantVote.withArgs('12345', '9900').calledOnce.should.be.true;
        done();
      }; 

      request(app).get(url).expect(201, afterRequest);
    });
  });
});
