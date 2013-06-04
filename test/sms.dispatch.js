var sinon = require('sinon'),
  app = require('../app'),
  request = require('supertest'),
  sms = require('../routes/sms'),
  settings = require('../settings'),
  Participant = require('../models/participant');

describe('SMS dispatch', function() {
  var stubSmsSendSms;

  beforeEach(function(done) {
    stubSmsSendSms = sinon.stub(sms, 'sendSms');
    Participant.remove({}, done);
  });

  afterEach(function(done) {
    stubSmsSendSms.restore();
    Participant.remove({}, done);
  });

  describe('#register', function() {
    
    describe('when valid username and not registered', function(){
      it('sends sms pin and responds with 201', function(done) {
        var url = '/sms/?mobile=1234567890&response=Username&message_id=0';
        var afterRequest = function(err, res) {
          stubSmsSendSms.called.should.be.true;
          Participant.findOne({phoneNumber: '1234567890'}, function(err, p) {
            stubSmsSendSms.withArgs('This is your PIN: ' + p.pin, '1234567890', settings.burstApi).calledOnce.should.be.true;
            done();
          });
        };

        request(app).get(url).expect(201, afterRequest);
      });

      describe('when registered', function(){
        it('sends sms already registered and pin and responds with 201', function(done) {
          var url = '/sms/?mobile=1234567890&response=Username&message_id=0';
          Participant.register('1234567890', 'username', function(err, p){
            var afterRequest = function(err, res) {
              stubSmsSendSms.called.should.be.true;
              Participant.findOne({phoneNumber: '1234567890'}, function(err, p) {
                stubSmsSendSms.withArgs('You are already registered. Your PIN is ' + p.pin, '1234567890', settings.burstApi).calledOnce.should.be.true;
                done();
              });
            };

            request(app).get(url).expect(201, afterRequest);
          });
        });
      });
    });

    describe('when username taken', function() {
      it('sends sms username taken', function(done) {
        Participant.register('0411222111', 'username', function(err, p) {
          var url = '/sms/?mobile=1234567890&response=username&message_id=0';
          var afterRequest = function(err, res) {
            stubSmsSendSms.called.should.be.true;
            stubSmsSendSms.withArgs('Username already taken', '1234567890', settings.burstApi).calledOnce.should.be.true;
            done();
          };
          request(app).get(url).expect(201, afterRequest);
        });
      });
    });
  });

  describe('#vote', function() {
    describe('when no error', function() {
      it('responds with 201', function(done) {
        Participant.register('0411222111', 'username', function(err, p) {
          var url = '/sms/?mobile=12345&response=' + p.pin + '&message_id=0';
          var afterRequest = function(err, res) {
            stubSmsSendSms.called.should.be.true;
            stubSmsSendSms.withArgs('Thank you for voting to ' + p.pin, '12345', settings.burstApi).calledOnce.should.be.true;
            done();
          };
          request(app).get(url).expect(201, afterRequest);
        });
      });
    });

    describe('when invalid pin', function() {
      it('sends sms with the error and responds with 201', function(done) {
        var url = '/sms/?mobile=12345&response=9900&message_id=0',
          stubParticipantVote = sinon.stub(Participant, 'vote', function(a,b,cb) {
              cb(new Error());
          });

        var afterRequest = function(err, res) {
          stubParticipantVote.called.should.be.true;
          stubParticipantVote.withArgs('12345', '9900').calledOnce.should.be.true;
          stubSmsSendSms.called.should.be.true;
          stubSmsSendSms.withArgs('User with pin: "9900" not found', '12345', settings.burstApi).calledOnce.should.be.true;
            
          stubParticipantVote.restore();
          done();
        };

        request(app).get(url).expect(201, afterRequest);
      });
    });
  });
});