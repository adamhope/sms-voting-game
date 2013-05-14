var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var voteSchema = mongoose.Schema({
  pin: String,
  phonenumber: String,
  votes: Number
});

var vote = mongoose.model('Vote', voteSchema);

exports.list = function(req, res) {
  vote.find(function(err, votes) {
    console.log(votes);
    res.render('votes/index', {
      title: 'Votes',
      votes: votes
    });
  });
};
