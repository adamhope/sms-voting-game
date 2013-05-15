var express        = require('express'),
  http             = require('http'),
  path             = require('path'),
  mongoose         = require('mongoose'),
  stylus           = require('stylus'),
  routes           = require('./routes'),
  participants     = require('./routes/participants'),
  Participant      = require('./models/participant'),
  scoreboard       = require('./routes/scoreboard')
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
if (app.get('env') == 'development') {
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/sms-voting-game-development');
}

app.get('/', routes.index);
app.get('/participants', participants.list);
app.post('/participants/create', participants.create);
app.post('/participants/connect', participants.connect);

app.get('/scoreboard/1', scoreboard.highcharts);
app.get('/scoreboard/2', scoreboard.sigma);
app.get('/scoreboard/3', scoreboard.d3);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

seed();
