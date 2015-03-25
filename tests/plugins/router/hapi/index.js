var Hapi = require('hapi');
var assert = require('chai').assert;
var root = require('app-root-path');
var router = require(root + '/plugins/router/');
var accept = require('gengojs-accept');

describe('router - hapi', function() {
  var server = new Hapi.Server();
  var handler = function(request, reply) {
    var result = router(accept(request).request, ['en-us']);
    return reply({
      array: result.toArray(),
      dot: result.toDot()
    });
  };
  server.connection({
    port: 80
  });
  server.route([{
    method: 'GET',
    path: '/',
    handler: handler
  }, {
    method: 'GET',
    path: '/hello',
    handler: handler
  }, {
    method: 'GET',
    path: '/hello/world',
    handler: handler
  }, {
    method: 'GET',
    path: '/api/v1.0',
    handler: handler
  }, {
    method: 'GET',
    path: '/api/v1.0/en',
    handler: handler
  }]);

  describe('/', function() {
    it('should === ["index"] && === "index"', function(done) {
      server.inject('/', function(res) {
        var result = res.result;
        assert.deepEqual(result.array, ['index']);
        assert.strictEqual(result.dot, 'index');
        done();
      });

    });
  });
  describe('/hello', function() {
    it('should === ["index", "hello"] && === "index.hello"', function(done) {
      server.inject('/hello', function(res) {
        var result = res.result;
        assert.deepEqual(result.array, ['hello']);
        assert.strictEqual(result.dot, 'hello');
        done();
      });

    });
  });
  describe('/hello/world', function() {
    it('should === ["index", "hello", "world"] && === "index.hello.world"', function(done) {
      server.inject('/hello/world', function(res) {
        var result = res.result;
        assert.deepEqual(result.array, ['hello', 'world']);
        assert.strictEqual(result.dot, 'hello.world');
        done();
      });
    });
  });
  describe('/api/v1.0', function() {
    it('should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
      server.inject('/api/v1.0', function(res) {
        var result = res.result;
        assert.deepEqual(result.array, ['api', 'v1*0']);
        assert.strictEqual(result.dot, 'api.v1*0');
        done();
      });
    });
  });
  describe('/api/v1.0/en', function() {
    it('should === ["index", "api", "v1*0"] && === "index.hello.v1*0"', function(done) {
      server.inject('/api/v1.0/en', function(res) {
        var result = res.result;
        assert.deepEqual(result.array, ['api', 'v1*0']);
        assert.strictEqual(result.dot, 'api.v1*0');
        done();
      });
    });
  });
  server.stop(function() {});
});