var app = require('../app')
  , request = require('supertest')
  , express = require('express');


describe('GET /participants', function(){
  it('respond with 201', function(done){
    request(app)
      .get('/participants')
      .expect(201, done());
  });
});

describe('SMS handle', function(){
  it('respond with 201', function(done){
    request(app)
      .get('/sms/handle?mobile=61414213852&response=TW+hdbsh6hs&message_id=0')
      .expect(201, done());
  });
});
