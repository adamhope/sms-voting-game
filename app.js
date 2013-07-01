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
  seed = require('./seed'),
  settings        = require('./settings');

var app = express();

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
app.use(express.errorHandler());

mongoose.connect(settings.db.uri, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + settings.db.uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + settings.db.uri);
  }
});

app.configure('development', function() {
    seed();
});

var auth = express.basicAuth(settings.auth.username, settings.auth.password);

app.get('/', routes.index);
app.get('/participants', auth, participants.list);
app.get('/participants/json', participants.json);
app.get('/participants/links', participants.links);
app.post('/participants/create', auth, participants.create);
app.post('/participants/vote', auth, participants.vote);
app.post('/participants/delete', auth, participants.delete);

app.get('/sms/dispatch', sms.dispatch);
app.get('/sms', auth, sms.index);
app.post('/sms/startbroadcast', auth, sms.startBroadcast);
app.post('/sms/stopbroadcast', auth, sms.stopBroadcast);

app.get('/display/leaderboard', scoreboard.leaderboard);
app.get('/display/network-graph', scoreboard.dashboard);
app.get('/display/hierarchial-edge-bundling', scoreboard.hierarchialEdgeBundling);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
