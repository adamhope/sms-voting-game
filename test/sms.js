var app = require('../app')
  , request = require('supertest')
  , express = require('express'),
  Participant = require('../models/participant'),
  sinon = require('sinon'),
  sms = require('../routes/sms'),
  http = require('http')
  settings = require('../settings');

describe('#buildSendSmsUrl', function() {
  it('should return correct URL', function() {
    var smsSettings = { 
      key: "someKey",
      secret: "thoughtworks",
      url: "http://www.some-url.com/sms/",
      callerId: '041111111111'
    };
    var url = sms.buildSendSmsUrl("Hello world", "0414213852", smsSettings);
    var expectedURL = "http://www.some-url.com/sms/messages.single?apikey=someKey&apisecret=thoughtworks&mobile=0414213852&message=Hello+world&caller_id=041111111111"
    url.should.equal(expectedURL);
  });
});

describe('#sendSms', function() {
  it('sends SMS', function() {
    var stubHttpGet = sinon.stub(http, 'get'),
      stubSmsBuildSendSmsUrl = sinon.stub(sms, 'buildSendSmsUrl');
      req = {on: function(){}};
    stubHttpGet.returns(req);
    stubSmsBuildSendSmsUrl.returns('aUrl');

    sms.sendSms("Hello world", "0411221122", settings.burst);

    stubHttpGet.called.should.be.true;
    stubHttpGet.withArgs('aUrl').calledOnce.should.be.true;
    stubHttpGet.restore();
    stubSmsBuildSendSmsUrl.restore();
  });
});

describe('SMS dispatch', function(){

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#register', function() {
    it('sends sms pin and responds with 201', function(done){
      var url = '/sms/?mobile=12345&response=Username&message_id=0',
        participant = {pin: '1234', phoneNumber: '1234567890'},
        stubParticipantRegister = sinon.stub(Participant, 'register', function(phoneNumber, username, callback){
        callback(null, participant);
      }),
      stubSmsSendSms = sinon.stub(sms, 'sendSms');

      var afterRequest = function(err, res) {
        stubParticipantRegister.called.should.be.true;
        stubParticipantRegister.withArgs("12345").calledOnce.should.be.true;
        stubSmsSendSms.called.should.be.true;
        stubSmsSendSms.withArgs('This is your PIN: 1234', '1234567890', settings.burstApi).calledOnce.should.be.true;
        stubParticipantRegister.restore();
        stubSmsSendSms.restore();
        done();
      }; 

      request(app).get(url).expect(201, afterRequest);
    });
  });

  describe('#vote', function() {
    it('responds with 201', function(done){
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
