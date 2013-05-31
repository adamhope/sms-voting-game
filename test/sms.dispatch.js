var sinon = require('sinon'),
  app = require('../app'),
  request = require('supertest'),
  sms = require('../routes/sms'),
  settings = require('../settings');

describe('SMS dispatch', function() {
  var stubSmsSendSms;

  beforeEach(function() {
    stubSmsSendSms = sinon.stub(sms, 'sendSms');
  });

  afterEach(function(done) {
    stubSmsSendSms.restore();
    Participant.remove({}, done);
  });

  describe('#register', function() {
    it('sends sms pin and responds with 201', function(done) {
      var url = '/sms/?mobile=1234567890&response=Username&message_id=0',
        participant = {
          pin: '1234',
          phoneNumber: '1234567890'
        },
        stubParticipantRegister = sinon.stub(Participant, 'register', function(phoneNumber, username, callback) {
          callback(null, participant);
        });

      var afterRequest = function(err, res) {
        stubParticipantRegister.calledOnce.should.be.true;
        // stubParticipantRegister.withArgs("1234567890", 'username').calledOnce.should.be.true;
        stubSmsSendSms.called.should.be.true;
        stubSmsSendSms.withArgs('This is your PIN: 1234', '1234567890', settings.burstApi).calledOnce.should.be.true;
        stubParticipantRegister.restore();
        done();
      };

      request(app).get(url).expect(201, afterRequest);
    });
  });

  describe('#vote', function() {
    describe('when no error', function() {

      it('responds with 201', function(done) {
        var url = '/sms/?mobile=12345&response=9900&message_id=0',
          stubParticipantVote = sinon.stub(Participant, 'vote', function(a,b,cb) {
              cb();
          });

        var afterRequest = function(err, res) {
          stubParticipantVote.called.should.be.true;
          stubParticipantVote.withArgs('12345', '9900').calledOnce.should.be.true;
          stubSmsSendSms.called.should.be.false;
          stubParticipantVote.restore();
          done();
        };

        request(app).get(url).expect(201, afterRequest);
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
          stubSmsSendSms.withArgs('User with pin 9900 not found', '12345', settings.burstApi).calledOnce.should.be.true;
            
          stubParticipantVote.restore();
          done();
        };

        request(app).get(url).expect(201, afterRequest);
      });
    });
  });
});