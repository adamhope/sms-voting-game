var http = require('http'),
  async = require('async');

// message is [[number,response],[number,response], ...]
process.on('message', function(message, callback) {
  async.each(message, function(req, cb) {
    sendSms(req[0], req[1], cb);
  }, function(err) {
    callback();
  });
});

function sendSms(number, response, callback) {
  var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/sms/?mobile='+number+'&response='+response+'&message_id=0&sms=disabled',
    method: 'GET'
  };
  var req = http.request(options, function(res) {
    callback();
  });
  req.on('errror', function(err){
    console.log('problem with request: ' + e.message);
  });
  req.end();
}

console.log('Worker: Started!');