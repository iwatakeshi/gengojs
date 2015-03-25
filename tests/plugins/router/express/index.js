var express = require('express');
var app = express();
var root = require('app-root-path');
var router = require(root + '/plugins/router/');
var request = require('supertest');
var assert = require('chai').assert;

describe('router - express', function() {
  app.use(function(req, res) {
    var result = router(req, ['en-us']);
    res.send({
      array: result.toArray(),
      dot: result.toDot()
    });
  });
  app.get('/');
  app.get('/hello');
  app.get('/hello/world');
  app.get('/api/v1.0');
  app.get('/api/v1.0/en-us');

  describe('/', function() {
    it('should === ["index"] && === "index"', function(done) {
      request(app)
        .get('/')
        .expect(function(res) {
          var result = res.body;
          assert.deepEqual(result.array, ['index']);
          assert.strictEqual(result.dot, 'index');
        })
        .end(done);
    });
  });
  describe('/hello', function() {
    it('should === ["index", "hello"] && === "index.hello"', function(done) {
      request(app)
        .get('/hello')
        .expect(function(res) {
          var result = res.body;
          assert.deepEqual(result.array, ['hello']);
          assert.strictEqual(result.dot, 'hello');
        })
        .end(done);
    });
  });

  describe('/hello/world', function() {
    it('should === ["index", "hello", "world"] && === "index.hello.world"', function(done) {
      request(app)
        .get('/hello/world')
        .expect(function(res) {
          var result = res.body;
          assert.deepEqual(result.array, ['hello', 'world']);
          assert.strictEqual(result.dot, 'hello.world');
        })
        .end(done);
    });
  });
  describe('/api/v1.0', function() {
    it('should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
      request(app)
        .get('/api/v1.0')
        .expect(function(res) {
          var result = res.body;
          assert.deepEqual(result.array, ['api', 'v1*0']);
          assert.strictEqual(result.dot, 'api.v1*0');
        })
        .end(done);
    });
  });
  describe('/api/v1.0/en', function() {
    it('should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
      request(app)
        .get('/api/v1.0/en-us')
        .expect(function(res) {
          var result = res.body;
          assert.deepEqual(result.array, ['api', 'v1*0']);
          assert.strictEqual(result.dot, 'api.v1*0');
        })
        .end(done);
    });
  });
});