
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'SMS Voting Game', bodyClass: 'home' });
};
