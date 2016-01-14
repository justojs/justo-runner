//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Runner = require("../../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Runner", function() {
  var loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
  });

  describe("#constructor()", function() {
    it("constructor()", function() {
      (function() {
        var runner = new Runner();
      }).must.raise("Expected runner configuration.");
    });

    it("constructor(config) - without reporters", function() {
      (function() {
        var runner = new Runner({loggers: {}});
      }).must.raise("Expected reporters.");
    });

    it("constructor(config) - without loggers", function() {
      (function() {
        var runner = new Runner({reporters: {}});
      }).must.raise("Expected loggers.");
    });

    it("constructor(config)", function() {
      var runner = new Runner({loggers: {}, reporters: {}});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
    });
  });

  it("#publishInto(object)", function() {
    var justo = {}, runner = new Runner({loggers, reporters});
    runner.publishInto(justo);
    justo.simple.must.be.eq(runner.simple);
    justo.macro.must.be.eq(runner.macro);
    justo.workflow.must.be.eq(runner.workflow);
  });

  it("#unpublishFrom(object)", function() {
    var justo = {}, runner = new Runner({loggers, reporters});
    runner.publishInto(justo);
    runner.unpublishFrom(justo);
    justo.must.not.have(["simple", "macro", "workflow"]);
  });

  describe("#runAsyncFunction()", function() {
    var runner;

    beforeEach(function() {
      runner = new Runner({loggers, reporters});
    });

    it("runAsyncFunction() - ok", function() {
      function async(params, done) {
        setTimeout(function() {
          done();
        }, 1000);
      }

      assert(runner.runAsyncFunction(async, []) === undefined);
    });

    it("runAsyncFunction() - done(msg)", function() {
      function async(params, done) {
        setTimeout(function() {
          done("The error.");
        }, 1000);
      }

      runner.runAsyncFunction(async, []).must.be.eq(new Error("The error."));
    });

    it("runAsyncFunction() - done(Error)", function() {
      function async(params, done) {
        setTimeout(function() {
          done(new Error("The error."));
        }, 1000);
      }

      runner.runAsyncFunction(async, []).must.be.eq(new Error("The error."));
    });
  });
});
