
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.leaderboard = function(req, res){
  res.render('scoreboard/leaderboard', {title: 'Leaderboard', bodyClass: 'leaderboard'});
};

exports.dashboard = function(req, res){
  res.render('scoreboard/dashboard', {title: 'Dashboard', bodyClass: 'dashboard'});
};

exports.hierarchialEdgeBundling = function(req, res){
  res.render('scoreboard/hierarchial_edge_bundling', {title: 'Hierachial Edge Bundling', bodyClass: 'heirarchial-edge-bundling'});
};
