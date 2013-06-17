var should = require("should"),
  Participant = require("../models/participant"),
  ApplicationError = require('../models/application_error')
  async = require('async'),
  _ = require('underscore');


describe('Participant', function() {
  var participants = [];
  
  beforeEach(function(done) {    
    async.series([
      function(nextSerie) {
        Participant.remove({}, nextSerie);
      },

      function(nextSerie) {
        async.timesSeries(200, function(n, next) {
          Participant.register('04000' + n, 'username' + n, function(err, p){
            participants.push(p);
            next();
          });

        }, nextSerie);
      }
    ], function() {
      done();
    });
  });

  afterEach(function(done) {
    Participant.remove({}, done);
  });

  describe('#createUniquePin', function() {
    it('creates unique pin number on registration', function() {
      _.uniq(participants.map(function(p) {return p.pin;})).length.should.eql(participants.length);
    });

    it('creates unique pin of 5 digits', function() {
      _.every(participants, function(p){return p.pin >= 1000 && p.pin <= 9999;}).should.be.true;
    }); 
  });
});
