//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const SimpleTask = require("justo-task").SimpleTask;
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("SimpleTask", function() {
  var runner, task, loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()"]);
    runner = new Runner({loggers, reporters});
    task = runner.task;
  });

  describe("#task()", function() {
    function fn() {}

    it("task()", function() {
      (function() {
        var fw = task();
      }).must.raise("Invalid number of arguments. At least, the task function must be passed.");
    });

    it("task(fn)", function() {
      var fw = task(fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: undefined,
        name: "fn",
        description: undefined
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("task(opts, fn)", function() {
      var fw = task({desc: "Description."}, fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: undefined,
        name: "fn",
        description: "Description."
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("task(name, fn)", function() {
      var fw = task("test", fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: undefined,
        name: "test",
        description: undefined
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("task(name, opts, fn)", function() {
      var fw = task("test", {desc: "Description."}, fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: undefined,
        name: "test",
        description: "Description."
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("task(ns, name, fn)", function() {
      var fw = task("ns", "test", fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: "ns",
        name: "test",
        description: undefined
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("task(ns, name, opts, fn)", function() {
      var fw = task("ns", "test", {desc: "Description."}, fn);

      fw.must.be.instanceOf(Function);
      fw.task.must.be.instanceOf(SimpleTask);
      fw.task.must.have({
        namespace: "ns",
        name: "test",
        description: "Description."
      });
      fw.task.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });
  });

  describe("Wrapper", function() {
    it("call()", function() {
      var fw = task(function() {});
      fw.must.raise("Invalid number of arguments. At least, the title must be specified.");
    });

    it("call(title)", function() {
      var pp, fw = task(function(params) { pp = params; });
      fw("title");
      pp.must.be.eq([]);
    });

    it("call(title, params)", function() {
      var pp, fw = task(function(params) { pp = params; });
      fw("title", 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("call(opts)", function() {
      var pp, fw = task(function(params) { pp = params; });
      fw({title: "title"});
      pp.must.be.eq([]);
    });

    it("call(opts, params)", function() {
      var pp, fw = task(function(params) { pp = params; });
      fw({title: "title"}, 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("injection", function() {
      var inj;
      var fw = task(function(params, log, logger) { inj = [params, log, logger]; });
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
          reporters: spy({}, ["start() {}", "end() {}"]),
          loggers: spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"])
        }
      ));

      task = runner.task;
    });

    it("Ignore", function() {
      var fw = task(function sum(params) { return params[0] + params[1]; });

      assert(fw.ignore("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("SimpleTask");
      runner.reporters.spy.getCall("end()").arguments.slice(1).must.be.eq(["ignored", undefined, undefined, undefined]);

      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring simple task 'test'.");
    });

    it("Mute", function() {
      var fw = task(function sum(params) { return params[0] + params[1]; });

      assert(fw.mute("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'ok' state.");
    });

    it("Ok", function() {
      var fw = task(function sum(params) { return params[0] + params[1]; });

      fw("test", 1, 2).must.be.eq(3);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("SimpleTask");
      runner.reporters.spy.getCall("end()").arguments[1].must.be.eq("ok");
      assert(runner.reporters.spy.getCall("end()").arguments[2] === undefined);
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'ok' state.");
    });

    it("Failed", function() {
      var fw = task(function raise(params) { throw new Error(params[0]); });

      assert(fw("test", "Test error.") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("SimpleTask");
      runner.reporters.spy.getCall("end()").arguments[1].must.be.eq("failed");
      runner.reporters.spy.getCall("end()").arguments[2].must.be.eq(new Error("Test error."));
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of simple task 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of simple task 'test' in 'failed' state.");
    });
  });
});
