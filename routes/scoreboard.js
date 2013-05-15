
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.highcharts = function(req, res){
  res.render('scoreboard_highcharts', {title: 'Simple Scoreboard'});
};

exports.sigma = function(req, res){
  res.render('scoreboard_sigma', {title: 'D3 Experiments'});
};

exports.d3 = function(req, res){
  res.render('scoreboard_d3', {title: 'D3 Experiments'});
};
