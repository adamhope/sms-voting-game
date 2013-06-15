function settings(){
  switch(process.env.NODE_ENV || 'development') {
    case 'production':
      return production();
    case 'development':
      return development();
    case 'test':
      return test();
  }
}

function production() {
  var settings = {};

  settings.auth = {
    username: process.env.SETTINGS_AUTH_USERNAME || 'needtobechanged',
    password: process.env.SETTINGS_AUTH_PASSWORD || 'needtobechanged'
  };

  settings.db = {
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL
  };

  settings.burstApi = {
    url: process.env.SETTINGS_BURST_API_URL,
    key: process.env.SETTINGS_BURST_API_KEY,
    secret: process.env.SETTINGS_BURST_API_SECRET,
    callerId: process.env.SETTINGS_BURST_CALLER_ID
  };

  return settings;
}

function development() {
  var settings = {};

  settings.auth = {
    username: '',
    password: ''
  };

  settings.db = {
    uri: 'mongodb://localhost/sms-voting-game-development'
  };

  settings.burstApi = {
    url: "",
    key: "",
    secret: "",
    callerId: "",
  };

  return settings;
}

function test() {
  var settings = {};

  settings.auth = {
    username: '',
    password: ''
  };

  settings.db = {
    uri: 'mongodb://localhost/sms-voting-game-test'
  };

  settings.burstApi = {
    url: "",
    key: "",
    secret: "",
    callerId: "",
  };

  return settings;
}

module.exports = settings();
