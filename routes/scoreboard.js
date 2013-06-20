
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.leaderboard = function(req, res){
  res.render('scoreboard/leaderboard', {title: 'Leader board', bodyClass: 'leader-board'});
};

exports.dashboard = function(req, res){
  res.render('scoreboard/dashboard', {title: 'Dashboard', bodyClass: 'dashboard'});
};
