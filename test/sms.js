var app = require('../app'),
  sinon = require('sinon'),
  sms = require('../routes/sms'),
  http = require('http'),
  settings = require('../settings');

describe('#buildSendSmsUrl', function() {
  it('should return correct URL', function() {
    var smsSettings = {
      key: "someKey",
      secret: "thoughtworks",
      url: "http://www.some-url.com/sms/",
      callerId: '041111111111'
    };
    var url = sms.buildSendSmsUrl("Hello world", "0414213852", smsSettings);
    var expectedURL = "http://www.some-url.com/sms/messages.single?apikey=someKey&apisecret=thoughtworks&mobile=0414213852&message=Hello+world&caller_id=041111111111"
    url.should.equal(expectedURL);
  });
});

describe('#sendSms', function() {
  it('sends SMS', function() {
    var stubHttpGet = sinon.stub(http, 'get'),
      stubSmsBuildSendSmsUrl = sinon.stub(sms, 'buildSendSmsUrl'),
      req = {
        on: function() {}
      };
    stubHttpGet.returns(req);
    stubSmsBuildSendSmsUrl.returns('aUrl');

    sms.sendSms("Hello world", "0411221122", settings.burst);

    stubHttpGet.called.should.be.true;
    stubHttpGet.withArgs('aUrl').calledOnce.should.be.true;
    stubHttpGet.restore();
    stubSmsBuildSendSmsUrl.restore();
  });
});