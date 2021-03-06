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
        var url = '/sms/dispatch/?mobile=1234567890&response=Fred&message_id=0';
        var afterRequest = function(err, res) {
          stubSmsSendSms.called.should.be.true;
          Participant.findOne({phoneNumber: '1234567890'}, function(err, p) {
            stubSmsSendSms.withArgs('Fred, thank you for registering. Your PIN is ' + p.pin, '1234567890', settings.burstApi).calledOnce.should.be.true;
            done();
          });
        };

        request(app).get(url).expect(201, afterRequest);
      });

      describe('when registered', function(){
        it('sends sms already registered and pin and responds with 201', function(done) {
          var url = '/sms/dispatch/?mobile=1234567890&response=Fred&message_id=0';
          Participant.register('1234567890', 'Fred', function(err, p){
            var afterRequest = function(err, res) {
              stubSmsSendSms.called.should.be.true;
              Participant.findOne({phoneNumber: '1234567890'}, function(err, p) {
                stubSmsSendSms.withArgs('Fred, you are already registered and your PIN is ' + p.pin, '1234567890', settings.burstApi).calledOnce.should.be.true;
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
        Participant.register('0411222111', 'Fred', function(err, p) {
          var url = '/sms/dispatch/?mobile=1234567890&response=Fred&message_id=0';
          var afterRequest = function(err, res) {
            stubSmsSendSms.called.should.be.true;
            stubSmsSendSms.withArgs('Sorry, Fred is already taken. Please try a different username.', '1234567890', settings.burstApi).calledOnce.should.be.true;
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
        Participant.register('0411222111', 'fred', function(err, p) {
          Participant.register('0414213852', 'dom', function(err, voter) {
            var url = '/sms/dispatch/?mobile=0414213852&response=' + p.pin + '&message_id=0';
            var afterRequest = function(err, res) {
              stubSmsSendSms.called.should.be.true;
              stubSmsSendSms.withArgs('Thanks for connecting with fred', '0414213852', settings.burstApi).calledOnce.should.be.true;
              done();
            };
            request(app).get(url).expect(201, afterRequest);
          });
        });
      });
    });

    describe('when invalid pin', function() {
      it('sends sms with the error and responds with 201', function(done) {
        Participant.register('0414213852', 'dom', function(err, voter) {
          var url = '/sms/dispatch/?mobile=0414213852&response=12345&message_id=0';
          var afterRequest = function(err, res) {
            stubSmsSendSms.called.should.be.true;
            stubSmsSendSms.withArgs('Sorry, I can\'t find a user with PIN 12345.', '0414213852', settings.burstApi).calledOnce.should.be.true;
            done();
          };

          request(app).get(url).expect(201, afterRequest);
        });
      });
    });

    describe('when not registered', function() {
      it('responds with 400', function(done) {
        Participant.register('0411222111', 'fred', function(err, p) {
          var url = '/sms/dispatch/?mobile=0414213852&response=' + p.pin + '&message_id=0';
          var afterRequest = function(err, res) {
            stubSmsSendSms.called.should.be.true;
            stubSmsSendSms.withArgs('Sorry, you must register before connecting. SMS your full name to register', '0414213852', settings.burstApi).calledOnce.should.be.true;
            done();
          };
          request(app).get(url).expect(400, afterRequest);
        });
      });
    });
  });
});
