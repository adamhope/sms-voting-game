var app = require('../app')
  , request = require('supertest')
  , express = require('express'),
  Participant = require('../models/participant');

describe('SMS dispatch', function(){

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    it('respond with 201', function(done){
    request(app)
      .get('/sms/?mobile=12345&response=TW+Username&message_id=0')
      .expect(201, done);
    });
  });
});
