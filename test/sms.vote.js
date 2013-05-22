var sms = require('../routes/sms'),
  Participant = require('../models/participant'),
  sinon = require('sinon'),
  smsSupport = require('./support/sms_support');

describe('sms', function() {
  describe('#vote', function() {
    it('calls Participant#register', function() {
      stubParticipant = sinon.stub(Participant, 'vote'),
      sms.dispatch(smsSupport.reqVote, smsSupport.res);
      stubParticipant.called.should.be.true;
      stubParticipant.withArgs(smsSupport.reqVote.phoneNumber, smsSupport.reqVote.pin).calledOnce.should.be.true;
    });
  });
});
