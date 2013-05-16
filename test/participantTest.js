//var assert = require("assert");
var should = require("should");
var Participant = require("../models/participant");
describe('Participant', function(){
  
  it('should create a new participant with a given phone number', function(){
    var p = getParticipant();
    p.should.exist;
    p.score.should.equal(1);
  });

  describe('register', function(){
  });

  describe('connect', function() {
    it('should increase the score of a participant when voted for by another participant', function() {
      var p = getParticipant();
      
    });
  });
});

function getParticipant() {
  return new Participant({
    pin: "00000",
    phoneNumber: "0414213852",
    votedForBy: {
      "0414213852": null
    }
  });
}
