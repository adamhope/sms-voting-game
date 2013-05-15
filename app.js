var express      = require('express'),
  http           = require('http'),
  path           = require('path'),
  mongoose       = require('mongoose'),
  stylus         = require('stylus'),
  routes         = require('./routes'),
  participants   = require('./routes/participants'),
  Participant    = require('./models/participant'),
  force_directed = require('./routes/force_directed');

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
app.get('/force_directed', force_directed.force_directed);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Participant seeding

Participant.find(function(err, participants) {
  if (participants.length === 0) {
    new Participant({
      pin: "0000",
      phoneNumber: "0414213852",
      votedForBy: {
        '0404882585': null,
        '0404882583': null
      }
    }).save();
    new Participant({
      pin: "0001",
      phoneNumber: "0414213333",
      votedForBy: {
        '0404882585': null,
        '0404882583': null
      }
    }).save();
  }
});
