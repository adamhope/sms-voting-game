var express        = require('express'),
  http             = require('http'),
  path             = require('path'),
  mongoose         = require('mongoose'),
  stylus           = require('stylus'),
  routes           = require('./routes'),
  participants     = require('./routes/participants'),
  Participant      = require('./models/participant'),
  scoreboard       = require('./routes/scoreboard'),
  sms              = require('./routes/sms'),
  seed = require('./seed');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware({
    compress: true,
    src     : __dirname + '/stylesheets',
    dest    : __dirname + '/public'
 }));
app.use(express.static(path.join(__dirname + '/public')));

// development only
app.configure('development', function() {
  mongoose.connect('mongodb://localhost/sms-voting-game-development', function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else { 
      console.log ('Succeeded connected to: ' + uristring);
      seed();
    }
  });
});

app.configure('test', function() {
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/sms-voting-game-test');
});

app.configure('production', function() {
  var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
  mongoose.connect(uristring, function (err, res) {
    if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  });
});

app.get('/', routes.index);
app.get('/participants', participants.list);
app.get('/participants/json', participants.json);
app.get('/participants/links', participants.links);
app.post('/participants/create', participants.create);
app.post('/participants/vote', participants.vote);
app.get('/sms/dispatch', sms.dispatch);
app.get('/sms', sms.index);
app.post('/sms/startbroadcast', sms.startBroadcast);
app.post('/sms/stopbroadcast', sms.stopBroadcast);

app.get('/scoreboard/1', scoreboard.highcharts);
app.get('/scoreboard/2', scoreboard.d3);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
