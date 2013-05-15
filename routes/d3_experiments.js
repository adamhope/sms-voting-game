
/*
 * GET home page.
 */

exports.force_directed = function(req, res){
  res.render('d3_experiments', {title: 'D3 Experiments'});
};
