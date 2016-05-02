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

    it("constructor({loggers, reporters})", function() {
      var runner = new Runner({loggers: {}, reporters: {}});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
      runner.breakOnError.must.be.eq(false);
      runner.continueOnError.must.be.eq(true);
      runner.only.must.be.eq(false);
    });

    it("constructor({loggers, reporters, onError})", function() {
      var runner = new Runner({loggers: {}, reporters: {}, onError: "break"});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
      runner.breakOnError.must.be.eq(true);
      runner.continueOnError.must.be.eq(false);
      runner.only.must.be.eq(false);
    });

    it("constructor(config) - with !only", function() {
      var runner = new Runner({loggers: {}, reporters: {}});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
      runner.only.must.be.eq(false);
    });

    it("constructor(config) - with only", function() {
      var runner = new Runner({loggers: {}, reporters: {}, only: true});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
      runner.only.must.be.eq(true);
    });
  });

  describe("Members", function() {
    var runner;

    beforeEach(function() {
      runner = new Runner({loggers, reporters});
    });

    it("#publishInto(object)", function() {
      var justo = {};

      runner.publishInto(justo);

      justo.simple.must.be.same(runner.simple);
      justo.macro.must.be.same(runner.macro);
      justo.workflow.must.be.same(runner.workflow);
      justo.init.must.be.same(runner.init);
      justo.fin.must.be.same(runner.fin);
      justo.suite.must.be.same(runner.suite);
      justo.test.must.be.same(runner.test);
      justo.register.must.be.same(runner.catalog.catalog);
    });

    it("#unpublishFrom(object)", function() {
      var justo = {};

      runner.publishInto(justo);
      runner.unpublishFrom(justo);

      justo.must.not.have([
        "simple",
        "macro",
        "workflow",
        "register",
        "catalog",
        "init",
        "fin",
        "suite",
        "test"
      ]);
    });

    describe("#runAsyncFunction()", function() {
      it("runAsyncFunction() - done()", function() {
        function async(params, done) {
          setTimeout(function() {
            done();
          }, 1000);
        }

        assert(runner.runAsyncFunction(async, []) === undefined);
      });

      it("runAsyncFunction() - done(undefined, value)", function() {
        function async(params, done) {
          setTimeout(function() {
            done(undefined, "a value");
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

    describe.skip("runCatalogedTask()", function() {
      it("runCatalogedTask(fqn) - existing", function() {
        runner.catalog.catalog.simple("test", function() { return 123; });
        runner.runCatalogedTask("test", []).must.be.eq(123);
      });

      it("runCatalogedTask(fqn) - not existing", function() {
        runner.runCatalogedTask.must.raise(Error, ["unknown", []]);
      });
    });
  });
});
