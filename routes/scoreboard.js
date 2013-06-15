
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.leaderboard = function(req, res){
  res.render('scoreboard/leaderboard', {title: 'Scoreboard'});
};

exports.dashboard = function(req, res){
  res.render('scoreboard/dashboard', {title: 'D3'});
};
