var http = require('http'),
  async = require('async');

// message is [[number,response],[number,response], ...]
process.on('message', function(message, callback) {
  async.each(message, function(req, cb) {
    sendSms(req[0], req[1], cb);
  }, function(err) {
    callback(err);
  });
});

function sendSms(number, response, callback) {
  var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/sms/?mobile='+number+'&response='+response+'&message_id=0&sms=disabled',
    method: 'GET',
    /* By default, the HTTP Agent will only open 5 simultaneous connections. As a result, it will take long time to execute the tasks. */
    agent: false // sets absolutely no limit on concurrent HTTP requests
  };
  var req = http.request(options, function(res) {
    callback();
  });
  req.on('errror', function(err){
    console.log('problem with request: ' + e.message);
    callback(err);
  });
  req.end();
}

console.log('Worker: Started!');