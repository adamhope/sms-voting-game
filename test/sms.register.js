var sms = require('../routes/sms'),
  Participant = require('../models/participant'),
  sinon = require('sinon');

describe('sms', function() {
  describe('#register', function() {
    var req = {
          query: {
            mobile: '1234567890',
            response: 'TW ',
            message_id: '0'
          }
        },

        res = {
          send: function() {}
        };

    it('calls Participant#register', function() {
      stubParticipant = sinon.stub(Participant, 'register'),
      sms.dispatch(req, res);
      stubParticipant.called.should.be.true;
      stubParticipant.withArgs(req.query.mobile).calledOnce.should.be.true;
    });
  });
});
