
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.leaderboard = function(req, res){
  res.render('visualization/leaderboard', {title: 'Leaderboard', bodyClass: 'leaderboard'});
};

exports.forceDirected = function(req, res){
  res.render('visualization/force_directed', {title: 'Dashboard', bodyClass: 'dashboard'});
};

exports.hierarchialEdgeBundling = function(req, res){
  res.render('visualization/hierarchial_edge_bundling', {title: 'Hierachial Edge Bundling', bodyClass: 'heirarchial-edge-bundling'});
};
