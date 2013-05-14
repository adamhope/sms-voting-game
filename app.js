var express = require('express'),
  routes = require('./routes'),
  participants = require('./routes/participants'),
  http = require('http'),
  force_directed = require('./routes/force_directed'),
  http = require('http'),
  path = require('path'),
  Participant = require('./models/participant'),
  mongoose = require('mongoose');

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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/sms-voting-game-development');
}

app.get('/', routes.index);

app.get('/participants', participants.list);
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
      votes: {
        phoneNumber: "0404882585"
      }
    }).save();
    new Participant({
      pin: "0001",
      phoneNumber: "0414213333",
      votes: {
        phoneNumber: "0404882585"
      }
    }).save();
  }
});
