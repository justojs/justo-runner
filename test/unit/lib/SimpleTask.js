//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const SimpleTask = require("justo-task").SimpleTask;
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("SimpleTask", function() {
  var runner, simple, loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = new Runner({loggers, reporters});
    simple = runner.simple;
  });

  describe("#simple()", function() {
    function fn() {}

    it("simple()", function() {
      (function() {
        var fw = simple();
      }).must.raise("Invalid number of arguments. At least, the task function must be passed.");
    });

    it("simple(fn)", function() {
      var fw = simple(fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(SimpleTask);
      fw.__task__.must.have({
        namespace: undefined,
        name: "fn",
        description: undefined
      });
      fw.__task__.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("simple(opts, fn)", function() {
      var fw = simple({desc: "Description."}, fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(SimpleTask);
      fw.__task__.must.have({
        namespace: undefined,
        name: "fn",
        description: "Description."
      });
      fw.__task__.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("simple(name, fn)", function() {
      var fw = simple("test", fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(SimpleTask);
      fw.__task__.must.have({
        namespace: undefined,
        name: "test",
        description: undefined
      });
      fw.__task__.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });
  });

  describe("Wrapper", function() {
    it("call()", function() {
      var fw = simple(function() {});
      fw.must.raise("Invalid number of arguments. At least, the title must be specified.");
    });

    it("call(title)", function() {
      var pp, fw = simple(function(params) { pp = params; });
      fw("title");
      pp.must.be.eq([]);
    });

    it("call(title, params)", function() {
      var pp, fw = simple(function(params) { pp = params; });
      fw("title", 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("call(opts)", function() {
      var pp, fw = simple(function(params) { pp = params; });
      fw({title: "title"});
      pp.must.be.eq([]);
    });

    it("call(opts, params)", function() {
      var pp, fw = simple(function(params) { pp = params; });
      fw({title: "title"}, 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("injection", function() {
      var inj, fw = simple(function(params, log, logger) { inj = [params, log, logger]; });
      fw("title", 1, 2, 3);
      inj[0].must.be.eq([1, 2, 3]);
      inj[1].must.not.be.eq(undefined);
      inj[2].must.not.be.eq(undefined);
    });
  });

  describe("#[runSimpleTask]()", function() {
    beforeEach(function() {
      runner = spy(new Runner(
        {
          reporters: spy({}, ["start() {}", "end() {}", "ignore() {}"]),
          loggers: spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"])
        }
      ));

      simple = runner.simple;
    });

    it("Ignore", function() {
      var args, fw = simple(function sum(params) { return params[0] + params[1]; });

      assert(fw.ignore("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(1);

      args = runner.reporters.spy.getArguments("ignore()");
      args[0].must.be.eq("test");
      args[1].must.be.instanceOf("SimpleTask");

      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring simple task 'test'.");
    });

    it("Mute", function() {
      var fw = simple(function sum(params) { return params[0] + params[1]; });

      assert(fw.mute("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'OK' state.");
    });

    it("Ok", function() {
      var fw = simple(function sum(params) { return params[0] + params[1]; });

      fw("test", 1, 2).must.be.eq(3);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("SimpleTask");
      runner.reporters.spy.getCall("end()").arguments[1].name.must.be.eq("OK");
      assert(runner.reporters.spy.getCall("end()").arguments[2] === undefined);
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'OK' state.");
    });

    it("Failed", function() {
      var fw = simple(function raise(params) { throw new Error(params[0]); });

      assert(fw("test", "Test error.") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("SimpleTask");
      runner.reporters.spy.getCall("end()").arguments[1].name.must.be.eq("FAILED");
      runner.reporters.spy.getCall("end()").arguments[2].must.be.eq(new Error("Test error."));
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'FAILED' state.");
    });
  });
});
