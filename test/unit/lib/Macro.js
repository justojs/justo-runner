//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Macro = require("justo-task").Macro;
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Macro", function() {
  var runner, loggers, reporters, macro, task;
  function fn1() {}
  function fn2() {}
  function fn3() {}

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()"]);
    runner = new Runner({loggers, reporters});
    macro = runner.macro;
    task = runner.task;
  });

  describe("#macro()", function() {
    it("macro()", function() {
      (function() {
        var m = macro();
      }).must.raise("Invalid number of arguments. At least, the array of tasks must be passed.");
    });

    it("macro(tasks)", function() {
      var fw = macro([fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: undefined,
        name: "macro",
        description: undefined
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });

    it("macro(name, tasks)", function() {
      var fw = macro("test", [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: undefined,
        name: "test",
        description: undefined
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });

    it("macro(opts, tasks)", function() {
      var fw = macro({desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: undefined,
        name: "macro",
        description: "Description."
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });

    it("macro(name, opts, tasks)", function() {
      var fw = macro("test", {desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: undefined,
        name: "test",
        description: "Description."
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });

    it("macro(ns, name, tasks)", function() {
      var fw = macro("org.justojs", "test", [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: "org.justojs",
        name: "test",
        description: undefined
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });

    it("macro(ns, name, opts, tasks)", function() {
      var fw = macro("org.justojs", "test", {desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.macro.must.be.instanceOf(Macro);
      fw.macro.must.have({
        namespace: "org.justojs",
        name: "test",
        description: "Description."
      });
      fw.macro.tasks.must.be.eq([
        {task: fn1, params: undefined},
        {task: fn2, params: [1, 2, 3]},
        {task: fn3, params: [3, 2, 1]}
      ]);
      fw.ignore.must.be.instanceOf(Function);
    });
  });

  describe("Wrapper", function() {
    it("call()", function() {
      var fw = macro([]);
      fw.must.raise("Invalid number of arguments. At least, the title must be specified.");
    });

    describe("Tasks are functions", function() {
      var params1, params2, params3;
      function fn1() { params1 = arguments; }
      function fn2() { params2 = arguments; }
      function fn3() { params3 = arguments; }

      beforeEach(function() {
        params1 = params2 = params3 = undefined;
      });

      it("call(title)", function() {
        var fw = macro([fn1, fn2]);

        fw("test");
        params1.must.be.eq([]);
        params2.must.be.eq([]);
      });

      it("call(title) - with default parameters", function() {
        var fw = macro([{task: fn1, params: [1, 2, 3]}, {task: fn2, params: [3, 2, 1]}, fn3]);

        fw("test");
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(opts)", function() {
        var fw = macro([fn1, fn2]);

        fw({title: "test"});
        params1.must.be.eq([]);
        params2.must.be.eq([]);
      });

      it("call(opts) - with default parameters", function() {
        var fw = macro([{task: fn1, params: [1, 2, 3]}, {task: fn2, params: [3, 2, 1]}, fn3]);

        fw({title: "test"});
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(title, ...params)", function() {
        var fw = macro([fn1, fn2]);

        fw("test", 1, 2, 3);
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([1, 2, 3]);
      });

      it("call(title, ...params) - with default parameters", function() {
        var fw = macro([{task: fn1, params: [1, 2, 3]}, {task: fn2, params: [3, 2, 1]}, fn3]);

        fw("test", 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });

      it("call(opts, ...params)", function() {
        var fw = macro([fn1, fn2]);

        fw({title: "test"}, 1, 2, 3);
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([1, 2, 3]);
      });

      it("call(opts, ...params) - with default parameters", function() {
        var fw = macro([{task: fn1, params: [1, 2, 3]}, {task: fn2, params: [3, 2, 1]}, fn3]);

        fw({title: "test"}, 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });
    });

    describe("Tasks are simple tasks", function() {
      var params1, params2, params3;
      var task1, task2, task3;

      beforeEach(function() {
        params1 = params2 = params3 = undefined;
        task1 = task(function(params) { params1 = params; });
        task2 = task(function(params) { params2 = params; });
        task3 = task(function(params) { params3 = params; });
      });

      it("call(title)", function() {
        var fw = macro([task1, task2, task3]);

        fw("test");
        params1.must.be.eq([]);
        params2.must.be.eq([]);
        params3.must.be.eq([]);
      });

      it("call(title) - with default parameters", function() {
        var fw = macro([{task: task1, params: [1, 2, 3]}, {task: task2, params: [3, 2, 1]}, task3]);

        fw("test");
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(opts)", function() {
        var fw = macro([task1, task2, task3]);

        fw({title: "test"});
        params1.must.be.eq([]);
        params2.must.be.eq([]);
        params3.must.be.eq([]);
      });

      it("call(opts) - with default parameters", function() {
        var fw = macro([{task: task1, params: [1, 2, 3]}, {task: task2, params: [3, 2, 1]}, task3]);

        fw({title: "test"});
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(title, ...params)", function() {
        var fw = macro([task1, task2, task3]);

        fw("test", 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });

      it("call(title, ...params) - with default parameters", function() {
        var fw = macro([{task: task1, params: [1, 2, 3]}, {task: task2, params: [3, 2, 1]}, task3]);

        fw("test", 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });

      it("call(opts, ...params)", function() {
        var fw = macro([task1, task2, task3]);

        fw({title: "test"}, 1, 2, 3);
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([1, 2, 3]);
        params3.must.be.eq([1, 2, 3]);
      });

      it("call(opts, ...params) - with default parameters", function() {
        var fw = macro([{task: task1, params: [1, 2, 3]}, {task: task2, params: [3, 2, 1]}, task3]);

        fw({title: "test"}, 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });
    });

    describe("Tasks are macros", function() {
      var params1, params2, params3;
      var macro1, macro2, macro3;

      beforeEach(function() {
        params1 = params2 = params3 = undefined;
        macro1 = macro([function() { params1 = arguments; }]);
        macro2 = macro([function() { params2 = arguments; }]);
        macro3 = macro([function() { params3 = arguments; }]);
      });

      it("call(title)", function() {
        var fw = macro([macro1, macro2, macro3]);

        fw("test");
        params1.must.be.eq([]);
        params2.must.be.eq([]);
        params3.must.be.eq([]);
      });

      it("call(title) - with default parameters", function() {
        var fw = macro([{task: macro1, params: [1, 2, 3]}, {task: macro2, params: [3, 2, 1]}, macro3]);

        fw("test");
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(opts)", function() {
        var fw = macro([macro1, macro2, macro3]);

        fw({title: "test"});
        params1.must.be.eq([]);
        params2.must.be.eq([]);
        params3.must.be.eq([]);
      });

      it("call(opts) - with default parameters", function() {
        var fw = macro([{task: macro1, params: [1, 2, 3]}, {task: macro2, params: [3, 2, 1]}, macro3]);

        fw({title: "test"});
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([3, 2, 1]);
        params3.must.be.eq([]);
      });

      it("call(title, ...params)", function() {
        var fw = macro([macro1, macro2, macro3]);

        fw("test", 1, 2, 3);
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([1, 2, 3]);
        params3.must.be.eq([1, 2, 3]);
      });

      it("call(title, ...params) - with default parameters", function() {
        var fw = macro([{task: macro1, params: [1, 2, 3]}, {task: macro2, params: [3, 2, 1]}, macro3]);

        fw("test", 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });

      it("call(opts, ...params)", function() {
        var fw = macro([macro1, macro2, macro3]);

        fw({title: "test"}, 1, 2, 3);
        params1.must.be.eq([1, 2, 3]);
        params2.must.be.eq([1, 2, 3]);
        params3.must.be.eq([1, 2, 3]);
      });

      it("call(opts, ...params) - with default parameters", function() {
        var fw = macro([{task: macro1, params: [1, 2, 3]}, {task: macro2, params: [3, 2, 1]}, macro3]);

        fw({title: "test"}, 1, 3, 5);
        params1.must.be.eq([1, 3, 5]);
        params2.must.be.eq([1, 3, 5]);
        params3.must.be.eq([1, 3, 5]);
      });
    });
  });

  describe("#[runMacro]()", function() {
    beforeEach(function() {
      runner = spy(new Runner(
        {
          reporters: spy({}, ["start() {}", "end() {}"]),
          loggers: spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"])
        }
      ));

      macro = runner.macro;
      task = runner.task;
    });

    it("Ignore", function() {
      var fw = macro([function() { throw new Error(); }]);

      assert(fw.ignore("test") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("Macro");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("Macro");
      runner.reporters.spy.getCall("end()").arguments.slice(1).must.be.eq(["ignored", undefined, undefined, undefined]);

      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring macro 'test'.");
    });

    it("Ok", function() {
      var fw = macro([function() {}]);

      assert(fw("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("Macro");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("Macro");
      runner.reporters.spy.getCall("end()").arguments[1].must.be.eq("ok");
      assert(runner.reporters.spy.getCall("end()").arguments[2] === undefined);
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of macro 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of macro 'test' in 'ok' state.");
    });

    it("Failed", function() {
      var fw = macro([function raise(params) { throw new Error(params[0]); }]);

      assert(fw("test", "Test error.") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.getCall("start()").arguments.length.must.be.eq(2);
      runner.reporters.spy.getCall("start()").arguments[0].must.be.eq("test");
      runner.reporters.spy.getCall("start()").arguments[1].must.be.instanceOf("Macro");

      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.getCall("end()").arguments.length.must.be.eq(5);
      runner.reporters.spy.getCall("end()").arguments[0].must.be.instanceOf("Macro");
      runner.reporters.spy.getCall("end()").arguments[1].must.be.eq("failed");
      runner.reporters.spy.getCall("end()").arguments[2].must.be.eq(new Error("Test error."));
      runner.reporters.spy.getCall("end()").arguments[3].must.be.instanceOf(Number);
      runner.reporters.spy.getCall("end()").arguments[4].must.be.instanceOf(Number);

      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getCall("debug()", 0).arguments[0].must.be.eq("Starting run of macro 'test'.");
      runner.loggers.spy.getCall("debug()", 1).arguments[0].must.be.eq("Ended run of macro 'test' in 'failed' state.");
    });
  });
});
