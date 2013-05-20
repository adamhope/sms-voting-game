var smsDispatch = require('../models/sms_dispatcher'),
  Participant = require('../models/participant'),
  sinon = require('sinon');

describe('smsDispatch', function() {
  describe('#dispatch', function() {
    
    describe('keyword is register', function() {
      it('calls Participant#register', function() {
        var stub = sinon.stub(Participant, 'register');
        smsDispatch.dispatch('0000000', 'register');
        stub.called.should.be.true;
      });
    });
  });
});
