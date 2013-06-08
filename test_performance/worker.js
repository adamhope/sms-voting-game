var http = require('http');

process.on('message', function(message, callback) {
  console.log('Worker: echoing ', message);
  sendSms(callback);
});

function sendSms(callback) {
  var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/sms/?mobile=0123232&response=fred&message_id=0&sms=disabled',
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