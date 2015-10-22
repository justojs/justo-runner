//imports
const assert = require("assert");
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Runner", function() {
  var runner;

  before(function() {
    runner = new Runner();
  });

  describe("#runSync()", function() {
    describe("Non-parameterized", function() {
      it("runSync(fn, undefined, {}) - pass", function() {
        function fn() { for (var i = 0; i < 100000000; ++i) i = i; }
        var res;

        res = runner.runSync(fn, undefined, {});
        res.must.have({error: undefined});
        res.time.must.be.instanceOf(Number);
        res.time.must.be.gt(0);
      });

      it("runSync(fn, undefined, {}) - fail", function() {
        function fn() {
          for (var i = 0; i < 100000000; ++i) i = i;
          throw new Error("The error.");
        }

        var res;

        res = runner.runSync(fn, undefined, {});
        res.time.must.be.instanceOf(Number);
        res.time.must.be.gt(0);
        res.error.must.be.instanceOf(Error);
        res.error.message.must.be.eq("The error.");
      });
    });

    describe("Parameterized", function() {
      it("runSync(fn, undefined, {params}) - pass", function() {
        function fn(params) {
          if (!params) throw new Error();
          for (var i = 0; i < 100000000; ++i) i = i;
        }
        var res;

        res = runner.runSync(fn, undefined, {params: 123});
        res.must.have({error: undefined});
        res.time.must.be.instanceOf(Number);
        res.time.must.be.gt(0);
      });

      it("runSync(fn, undefined, {params}) - fail", function() {
        function fn(params) {
          for (var i = 0; i < 100000000; ++i) i = i;
          throw new Error(params);
        }

        var res;

        res = runner.runSync(fn, undefined, {params: "The error."});
        res.time.must.be.instanceOf(Number);
        res.time.must.be.gt(0);
        res.error.must.be.instanceOf(Error);
        res.error.message.must.be.eq("The error.");
      });
    });
  });

  describe("#runAsync()", function() {
    describe("Non-parameterized", function() {
      it("runAsync(fn, undefined, {}, done) - pass", function(done) {
        function fn(done) {
          for (var i = 0; i < 100000000; ++i) i = i;
          done();
        }

        function d(res) {
          res.must.have({error: undefined});
          res.time.must.be.instanceOf(Number);
          res.time.must.be.gt(0);
          done();
        }

        runner.runAsync(fn, undefined, {}, d);
      });

      it("runAsync(fn, undefined, {}) - fail", function(done) {
        function fn(done) {
          for (var i = 0; i < 100000000; ++i) i = i;
          done(new Error("The error."));
        }

        function d(res) {
          res.time.must.be.instanceOf(Number);
          res.time.must.be.gt(0);
          res.error.must.be.instanceOf(Error);
          res.error.message.must.be.eq("The error.");
          done();
        }

        runner.runAsync(fn, undefined, {}, d);
      });
    });

    describe("Parameterized", function() {
      it("runAsync(fn, undefined, {params}, done) - pass", function(done) {
        function fn(done, params) {
          if (!params) done(new Error());
          for (var i = 0; i < 100000000; ++i) i = i;
          done();
        }

        function d(res) {
          res.must.have({error: undefined});
          res.time.must.be.instanceOf(Number);
          res.time.must.be.gt(0);
          done();
        }

        runner.runAsync(fn, undefined, {params: 123}, d);
      });

      it("runAsync(fn, undefined, {params}) - fail", function(done) {
        function fn(done, params) {
          for (var i = 0; i < 100000000; ++i) i = i;
          done(new Error(params));
        }

        function d(res) {
          res.time.must.be.instanceOf(Number);
          res.time.must.be.gt(0);
          res.error.must.be.instanceOf(Error);
          res.error.message.must.be.eq("The error.");
          done();
        }

        runner.runAsync(fn, undefined, {params: "The error."}, d);
      });
    });
  });
});
