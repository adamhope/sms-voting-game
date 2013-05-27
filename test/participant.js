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
      var username = "HodorHodor";
      Participant.register(phoneNumberFrom, username, function(err, p) {
        if (err) return done(err);
        p.phoneNumber.should.equal(phoneNumberFrom);
        p.username.should.equal(username);
        p.score.should.equal(1);
        done();
      });
    });

    it('does not add participant if already registered', function(done) {
      var phoneNumberFrom = '041213852';
      var username = "Hodor";
      Participant.register(phoneNumberFrom, username, function(err, p1) {
        
        Participant.register(phoneNumberFrom, username, function(err, p2) {
          p1.id.should.equal(p2.id);
          p1.pin.should.equal(p2.pin);
          p1.phoneNumber.should.equal(p2.phoneNumber);
          p1.username.should.equal(p2.username);
          done();
        });
      });
    });
  });
});
