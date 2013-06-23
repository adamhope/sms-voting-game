var crypto = require('crypto'),
    _      = require('underscore'),
    fs     = require('fs'),
    faker  = require('Faker');

var hashJSON  = function (json) {
  var parsedJSON = require(json);
  return _.map(parsedJSON, function (p) {
      var oldPhoneNumber = p.phoneNumber;
      var oldName = p.username;
      p.phoneNumber = crypto.createHash('md5').update(oldPhoneNumber).digest("hex");
      p.username = faker.Name.findName();
      for (var key in p.votedForBy) {
        if (p.votedForBy.hasOwnProperty(key)) {
          var hashedKey = crypto.createHash('md5').update(key).digest("hex").toString();
          p.votedForBy[hashedKey] = null;
          delete p.votedForBy[key];
        }
      };
      return p;
    });
};

var hashedJSON = hashJSON('./participants.json');

var filename = './hashed_participants.json';

fs.writeFile(filename, JSON.stringify(hashedJSON, null, 4), function(err) { }); 
