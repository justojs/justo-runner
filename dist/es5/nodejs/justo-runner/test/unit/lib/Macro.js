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
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
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
      var tsk, fw = macro([fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: undefined,
        name: "macro",
        description: undefined
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("macro(name, tasks)", function() {
      var tsk, fw = macro("test", [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: undefined,
        name: "test",
        description: undefined
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("macro(opts, tasks)", function() {
      var tsk, fw = macro({desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: undefined,
        name: "macro",
        description: "Description."
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("macro(name, opts, tasks)", function() {
      var tsk, fw = macro("test", {desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: undefined,
        name: "test",
        description: "Description."
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("macro(ns, name, tasks)", function() {
      var tsk, fw = macro("org.justojs", "test", [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: "org.justojs",
        name: "test",
        description: undefined
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });

    it("macro(ns, name, opts, tasks)", function() {
      var tsk, fw = macro("org.justojs", "test", {desc: "Description."}, [fn1, {task: fn2, params: [1, 2, 3]}, {task: fn3, params: [3, 2, 1]}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf(Macro);
      fw.__task__.must.have({
        namespace: "org.justojs",
        name: "test",
        description: "Description."
      });

      tsk = fw.__task__.tasks[0];
      tsk.must.have({
        title: "fn1",
        params: undefined
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[1];
      tsk.must.have({
        title: "fn2",
        params: [1, 2, 3]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      tsk = fw.__task__.tasks[2];
      tsk.must.have({
        title: "fn3",
        params: [3, 2, 1]
      });
      tsk.task.must.be.instanceOf(Function);
      tsk.task.__task__.must.be.instanceOf("SimpleTask");

      fw.ignore.must.be.instanceOf(Function);
      fw.mute.must.be.instanceOf(Function);
    });
  });

  describe("Wrapper", function() {
    it("call()", function() {
      var fw = macro([]);
      fw.must.raise("Invalid number of arguments. At least, the title must be specified.");
    });

    describe("Tasks are simple tasks", function() {
      var params1, params2, params3;
      var task1, task2, task3;

      beforeEach(function() {
        params1 = params2 = params3 = undefined;

        task1 = task(function(params) { params1 = params; });
        task2 = function(params) { params2 = params; };
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

        macro1 = macro([function(params) { params1 = params; }]);
        macro2 = macro([function(params) { params2 = params; }]);
        macro3 = macro([function(params) { params3 = params; }]);
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
          reporters: spy({}, ["start() {}", "end() {}", "ignore() {}"]),
          loggers: spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"])
        }
      ));

      macro = runner.macro;
      task = runner.task;
    });

    it("Ignore", function() {
      var args, fw = macro([function() { throw new Error(); }]);

      assert(fw.ignore("test") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(1);

      args = runner.reporters.spy.getArguments("ignore()");
      args[0].must.be.eq("test");
      args[1].must.be.instanceOf("Macro");

      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring macro 'test'.");
    });

    it("Mute", function() {
      var fw = macro([function() {}]);

      assert(fw.mute("test") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(0);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(4);
      runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
      runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting run of simple task ''."]);
      runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended run of simple task '' in 'OK' state."]);
      runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
    });

    it("Ok", function() {
      var args, fw = macro([function() {}]);

      assert(fw("test", 1, 2) === undefined);

      runner.reporters.spy.called("start()").must.be.eq(2);
      args = runner.reporters.spy.getArguments("start()", 0);
      args[0].must.be.eq("test");
      args[1].must.be.instanceOf("Macro");
      args  = runner.reporters.spy.getArguments("start()", 1);
      args[0].must.be.eq("");
      args[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(2);
      args = runner.reporters.spy.getArguments("end()", 0);
      args.length.must.be.eq(5);
      args[0].must.be.instanceOf("SimpleTask");
      args[1].must.be.instanceOf("ResultState");
      args[1].must.be.eq("OK");
      assert(args[2] === undefined);
      args[3].must.be.instanceOf("Number");
      args[4].must.be.instanceOf("Number");
      args = runner.reporters.spy.getArguments("end()", 1);
      args.length.must.be.eq(1);
      args[0].must.be.instanceOf("Macro");

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(4);
      runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
      runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting run of simple task ''."]);
      runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended run of simple task '' in 'OK' state."]);
      runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
    });

    it("Failed", function() {
      var args, fw = macro([function raise(params) { throw new Error(params[0]); }]);

      assert(fw("test", "Test error.") === undefined);

      runner.reporters.spy.called("start()").must.be.eq(2);
      args = runner.reporters.spy.getArguments("start()", 0);
      args[0].must.be.eq("test");
      args[1].must.be.instanceOf("Macro");
      args  = runner.reporters.spy.getArguments("start()", 1);
      args[0].must.be.eq("raise");
      args[1].must.be.instanceOf("SimpleTask");

      runner.reporters.spy.called("end()").must.be.eq(2);
      args = runner.reporters.spy.getArguments("end()", 0);
      args.length.must.be.eq(5);
      args[0].must.be.instanceOf("SimpleTask");
      args[1].must.be.instanceOf("ResultState");
      args[1].must.be.eq("FAILED");
      args[2].must.be.instanceOf(Error);
      args[3].must.be.instanceOf("Number");
      args[4].must.be.instanceOf("Number");
      args = runner.reporters.spy.getArguments("end()", 1);
      args.length.must.be.eq(1);
      args[0].must.be.instanceOf("Macro");

      runner.reporters.spy.called("ignore()").must.be.eq(0);

      runner.loggers.spy.called("debug()").must.be.eq(4);
      runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
      runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting run of simple task 'raise'."]);
      runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended run of simple task 'raise' in 'FAILED' state."]);
      runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
    });
  });
});
