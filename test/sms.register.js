var sms = require('../routes/sms'),
  Participant = require('../models/participant'),
  sinon = require('sinon'),
  smsSupport = require('./support/sms_support');

describe('sms', function() {
  describe('#register', function() {
    it('calls Participant#register', function() {
      stubParticipant = sinon.stub(Participant, 'register'),
      sms.dispatch(smsSupport.reqRegister, smsSupport.res);
      stubParticipant.called.should.be.true;
      stubParticipant.withArgs(smsSupport.reqRegister.query.mobile).calledOnce.should.be.true;
    });
  });
});
