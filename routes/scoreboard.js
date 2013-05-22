
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.highcharts = function(req, res){
  res.render('scoreboard/scoreboard_highcharts', {title: 'Scoreboard'});
};

exports.sigma = function(req, res){
  res.render('scoreboard/scoreboard_sigma', {title: 'Sigma'});
};

exports.d3 = function(req, res){
  res.render('scoreboard/scoreboard_d3', {title: 'D3'});
};
