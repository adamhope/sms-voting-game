var app = require('../app')
  , request = require('supertest')
  , express = require('express'),
  Participant = require('../models/participant'),
  sinon = require('sinon'),
  sms = require('../routes/sms')
  http = require('http');



describe('#buildSendSmsUrl', function() {
  it('should return correct URL', function() {
    var smsSettings = { 
      key: "someKey",
      secret: "thoughtworks",
      url: "http://www.some-url.com/sms/"
    };
    var url = sms.buildSendSmsUrl("Hello world", "0414213852", smsSettings);
    var expectedURL = "http://www.some-url.com/sms/messages.single?apikey=someKey&apisecret=thoughtworks&mobile=0414213852&message=Hello+world&caller_id=thoughtworks"
    url.should.equal(expectedURL);
  });
});

describe('#sendSms', function() {
  var smsSettings = { 
    key: "someKey",
    secret: "thoughtworks",
    url: "http://burst.transmitsms.com/api"
  };

  it('sends SMS', function(done) {
    var stubHttpGet = sinon.stub(http, 'get', function(url, callback) { callback(url); }),
    // var stubHttpGet = sinon.stub(http, 'get'),
      stubSmsBuildSendSmsUrl = sinon.stub(sms, 'buildSendSmsUrl');
      req = {on: function(){}};
    // stubHttpGet.returns(req);
    stubSmsBuildSendSmsUrl.returns('aUrl');
    var afterTest = function(err, res) {
      stubHttpGet.called.should.be.true;
      stubHttpGet.withArgs('aUrl').calledOnce.should.be.true;
      stubHttpGet.restore();
      stubSmsBuildSendSmsUrl.restore();
      done();
    };
      
    sms.sendSms("Hello world", "0411221122", smsSettings, afterTest);
  });
});

describe('SMS dispatch', function(){

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    it('respond with 201', function(done){
      var url = '/sms/?mobile=12345&response=Username&message_id=0',
          stubParticipantRegister = sinon.stub(Participant, 'register');
      
      var afterRequest = function(err, res) {
        stubParticipantRegister.called.should.be.true;
        stubParticipantRegister.withArgs("12345").calledOnce.should.be.true;
        stubParticipantRegister.restore();
        done();
      }; 

      request(app).get(url).expect(201, afterRequest);
    });
  });

  describe('#vote', function() {
    it('respond with 201', function(done){
      var url = '/sms/?mobile=12345&response=9900&message_id=0',
          stubParticipantVote = sinon.stub(Participant, 'vote');
      
      var afterRequest = function(err, res) {
        stubParticipantVote.called.should.be.true;
        stubParticipantVote.withArgs('12345', '9900').calledOnce.should.be.true;
        stubParticipantVote.restore();
        done();
      }; 

      request(app).get(url).expect(201, afterRequest);
    });
  });
});
