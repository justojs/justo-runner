//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Workflow", function() {
  var runner, workflow, loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = new Runner({loggers, reporters});
    workflow = runner.workflow;
  });

  describe("#workflow()", function() {
    function fn() {}

    it("workflow()", function() {
      workflow.must.raise("Invalid number of arguments. At least, the workflow function must be passed.");
    });

    it("workflow(fn)", function() {
      var fw = workflow(fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("Workflow");
      fw.__task__.must.have({
        namespace: undefined,
        name: "fn",
        description: undefined
      });
      fw.__task__.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("workflow(opts, fn)", function() {
      var fw = workflow({desc: "Description."}, fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("Workflow");
      fw.__task__.must.have({
        namespace: undefined,
        name: "fn",
        description: "Description."
      });
      fw.__task__.fn.must.be.same(fn);
      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("workflow(name, fn)", function() {
      var fw = workflow("test", fn);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("Workflow");
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
      var fw = workflow(function() {});
      fw.must.raise("Invalid number of arguments. At least, the title must be specified.");
    });

    it("call(title)", function() {
      var pp, fw = workflow(function(params) { pp = params; });
      fw("title");
      pp.must.be.eq([]);
    });

    it("call(title, params)", function() {
      var pp, fw = workflow(function(params) { pp = params; });
      fw("title", 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("call(opts)", function() {
      var pp, fw = workflow(function(params) { pp = params; });
      fw({title: "title"});
      pp.must.be.eq([]);
    });

    it("call(opts, params)", function() {
      var pp, fw = workflow(function(params) { pp = params; });
      fw({title: "title"}, 1, 2, 3);
      pp.must.be.eq([1, 2, 3]);
    });

    it("injection", function() {
      var inj;
      var fw = workflow(function(params, log, logger) { inj = [params, log, logger]; });
      fw("title", 1, 2, 3);
      inj[0].must.be.eq([1, 2, 3]);
      inj[1].must.not.be.eq(undefined);
      inj[2].must.not.be.eq(undefined);
    });
  });

  describe("#[runWorkflow]()", function() {
    beforeEach(function() {
      runner = spy(new Runner(
        {
          reporters: spy({}, ["start() {}", "end() {}", "ignore() {}"]),
          loggers: spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"])
        }
      ));

      workflow = runner.workflow;
    });

    it("Ignore", function() {
      var args, fw = workflow(function sum(params) { return params[0] + params[1]; });

      assert(fw.ignore("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(1);

      args = runner.reporters.spy.getArguments("ignore()");
      args[0].must.be.eq("test");
      args[1].must.be.instanceOf("Workflow");

      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.getArguments("debug()")[0].must.be.eq("Ignoring workflow 'test'.");
    });

    it("Mute", function() {
      var fw = workflow(function sum(params) { return params[0] + params[1]; });

      assert(fw.mute("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getArguments("debug()", 0)[0].must.be.eq("Starting run of workflow 'test'.");
      runner.loggers.spy.getArguments("debug()", 1)[0].must.be.eq("Ended run of workflow 'test' in 'OK' state.");
    });

    it("Ok", function() {
      var fw = workflow(function sum(params) { return params[0] + params[1]; });

      fw("test", 1, 2).must.be.eq(3);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getArguments("start()").length.must.be.eq(2);
      runner.reporters.spy.getArguments("start()")[0].must.be.eq("test");
      runner.reporters.spy.getArguments("start()")[1].must.be.instanceOf("Workflow");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getArguments("end()").length.must.be.eq(5);
      runner.reporters.spy.getArguments("end()")[0].must.be.instanceOf("Workflow");
      runner.reporters.spy.getArguments("end()")[1].name.must.be.eq("OK");
      assert(runner.reporters.spy.getArguments("end()")[2] === undefined);
      runner.reporters.spy.getArguments("end()")[3].must.be.instanceOf(Number);
      runner.reporters.spy.getArguments("end()")[4].must.be.instanceOf(Number);

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of workflow 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of workflow 'test' in 'OK' state.");
    });

    it("Failed", function() {
      var fw = workflow(function raise(params) { throw new Error(params[0]); });

      assert(fw("test", "Test error.") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("Workflow");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("Workflow");
      runner.reporters.spy.getCall("end()").arguments[1].name.must.be.eq("FAILED");
      runner.reporters.spy.getCall("end()").arguments[2].must.be.eq(new Error("Test error."));
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of workflow 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of workflow 'test' in 'FAILED' state.");
    });
  });
});
