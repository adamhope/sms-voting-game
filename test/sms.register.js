var sms = require('../routes/sms'),
  Participant = require('../models/participant'),
  sinon = require('sinon');

describe('sms', function() {
  describe('#register', function() {

    it('calls Participant#register', function() {
      var phoneNumber = '041122112211',
        stubParticipant = sinon.stub(Participant, 'register'),
        stubSms = sinon.stub(sms, 'extract', function() {
          return {
            phoneNumber: phoneNumber
          }
        });

      sms.register();
      stubParticipant.called.should.be.true;
      stubParticipant.withArgs(phoneNumber).calledOnce.should.be.true;
    });
  });
});
