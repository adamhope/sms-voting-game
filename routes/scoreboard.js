
/*
 * A simple bargraph showing number of votes per person / connections to a person
 */

exports.simple = function(req, res){
  res.render('scoreboard_simple', {title: 'Simple Scoreboard'});
};


/*
 * GET home page.
 */

exports.d3 = function(req, res){
  res.render('scoreboard_d3', {title: 'D3 Experiments'});
};
