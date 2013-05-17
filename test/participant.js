//var assert = require("assert");
var should = require("should");
var Participant = require("../models/participant");
describe('Participant', function() {

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('register', function() {
    it('adds a new participant to the database', function(done) {
      var phoneNumberFrom = '041213852';
      Participant.register(phoneNumberFrom, function(err, p) {
        if (err) return done(err);
        p.phoneNumber.should.equal(phoneNumberFrom);
        p.score.should.equal(1);
        done();
      });
    });
  });
});
