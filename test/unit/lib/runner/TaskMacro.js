//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const TaskMacro = PKG.TaskMacro;
const Runner = PKG.Runner;

//suite
describe("TaskMacro (runner)", function() {
  var runner, loggers, reporters, macro, simple;
  function fn() {}
  function fn1() {}
  function fn2() {}
  function fn3() {}

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = new Runner({loggers, reporters, console});
    macro = runner.macro;
    simple = runner.simple;
  });

  describe("#Runner.macro()", function() {
    var task;

    beforeEach(function() {
      task = simple("cataloged", function() {});
      runner.catalog.add(task);
    });

    it("macro()", function() {
      macro.must.raise("Invalid number of arguments. At least, two: name and array or object.");
    });

    it("macro(name)", function() {
      macro.must.raise("Invalid number of arguments. At least, two: name and array or object.", ["test"]);
    });

    it("macro(opts, string[]) - cataloged tasks", function() {
      var fw = macro("test", ["cataloged"]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("TaskMacro");
      fw.__task__.name.must.be.eq("test");
      fw.__task__.tasks.must.be.eq([{title: "cataloged", task: task}]);
    });

    it("macro(opts, string[]) - non-cataloged tasks", function() {
      macro.must.raise("The 'unknown' task is not cataloged.", ["test", ["unknown"]]);
    });

    it("macro(opts, object[]) - cataloged tasks and no title", function() {
      var fw = macro("test", [{task: "cataloged"}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("TaskMacro");
      fw.__task__.name.must.be.eq("test");
      fw.__task__.tasks.must.be.eq([{title: "cataloged", task: task}]);
    });

    it("macro(opts, object[]) - cataloged tasks and with title", function() {
      var fw = macro("test", [{title: "one", task: "cataloged"}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("TaskMacro");
      fw.__task__.name.must.be.eq("test");
      fw.__task__.tasks.must.be.eq([{title: "one", task: task}]);
    });

    it("macro(opts, object[]) - non-cataloged tasks", function() {
      macro.must.raise("The 'unknown' task is not cataloged.", ["test", [{task: "unknown"}]]);
    });

    it("macro(opts, object[]) - with title", function() {
      var fw = macro("test", [{title: "one", task: task}]);

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("TaskMacro");
      fw.__task__.name.must.be.eq("test");
      fw.__task__.tasks.must.be.eq([{title: "one", task: task}]);
    });

    it("macro(opts, object[]) - without title", function() {
      macro.must.raise("Title must be specified.", ["test", [{task: task}]]);
    });
  });

  describe("Wrapper call", function() {
    it("call()", function() {
      var fw = macro("test", []);
      assert(fw() === undefined);
    });

    it("call(title)", function() {
      var fw = macro("test", []);
      assert(fw("test") === undefined);
    });

    it("call(title) - with task", function() {
      var fw = macro("test", [{title: "one", task: simple("task", function() {})}]);
      assert(fw("test") === undefined);
    });
  });

  describe("#runTaskMacro()", function() {
    beforeEach(function() {
      reporters = spy({}, ["start() {}", "end() {}", "ignore() {}"]);
      loggers = spy({}, ["debug() {}", "info() {}", "warn() {}", "error() {}", "fatal() {}"]);
    });

    describe("Ignore", function() {
      beforeEach(function() {
        runner = new Runner({loggers, reporters, console});
        macro = runner.macro;
        simple = runner.simple;
      });

      it("Explicitly", function() {
        var args, fw, exec;

        fw = macro("test", [{title: "one", task: simple("test", function() { exec = true; })}]);

        assert(fw.ignore("test") === undefined);
        assert(exec === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(1);

        args = runner.reporters.spy.getArguments("ignore()");
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("TaskMacro");

        runner.loggers.spy.called("debug()").must.be.eq(1);
        runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring macro 'test'.");
      });

      it("Implicitly", function() {
        var args, fw, exec;

        fw = macro({name: "test", ignore: true}, [{title: "one", task: simple("test", function() { exec = true; })}]);

        assert(fw("test") === undefined);
        assert(exec === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(1);

        args = runner.reporters.spy.getArguments("ignore()");
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("TaskMacro");

        runner.loggers.spy.called("debug()").must.be.eq(1);
        runner.loggers.spy.getCall("debug()").arguments[0].must.be.eq("Ignoring macro 'test'.");
      });
    });

    describe("Mute", function() {
      beforeEach(function() {
        runner = new Runner({loggers, reporters, console});
        macro = runner.macro;
        simple = runner.simple;
      });

      it("Explicitly", function() {
        var fw, exec;

        fw = macro("test", [{title: "one", task: simple("test", function() { exec = true; })}]);

        assert(fw.mute("test") === undefined);
        exec.must.be.eq(true);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(0);

        runner.loggers.spy.called("debug()").must.be.eq(4);
        runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
        runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting sync run of simple task 'one'."]);
        runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended sync run of simple task 'one' in 'OK' state."]);
        runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
      });

      it("Implicitly", function() {
        var fw, exec;

        fw = macro({name: "test", mute: true}, [{title: "one", task: simple("test", function() { exec = true; })}]);

        assert(fw("test") === undefined);
        exec.must.be.eq(true);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(0);

        runner.loggers.spy.called("debug()").must.be.eq(4);
        runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
        runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting sync run of simple task 'one'."]);
        runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended sync run of simple task 'one' in 'OK' state."]);
        runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
      });
    });

    describe("OK", function() {
      beforeEach(function() {
        runner = new Runner({loggers, reporters, console});
        macro = runner.macro;
        simple = runner.simple;
      });

      it("OK", function() {
        var args, fw, exec;

        fw = macro("test", [{title: "one", task: simple("test", function() { exec = true; })}]);

        assert(fw("test", 1, 2) === undefined);
        exec.must.be.eq(true);

        runner.reporters.spy.called("start()").must.be.eq(2);
        args = runner.reporters.spy.getArguments("start()", 0);
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("TaskMacro");
        args  = runner.reporters.spy.getArguments("start()", 1);
        args[0].must.be.eq("one");
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
        args[0].must.be.instanceOf("TaskMacro");

        runner.reporters.spy.called("ignore()").must.be.eq(0);

        runner.loggers.spy.called("debug()").must.be.eq(4);
        runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
        runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting sync run of simple task 'one'."]);
        runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended sync run of simple task 'one' in 'OK' state."]);
        runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test'."]);
      });
    });

    describe("Failed", function() {
      it("Failed - continue on error", function() {
        var args, fw, exec1, exec2;

        runner = new Runner({loggers, reporters, console});
        macro = runner.macro;
        simple = runner.simple;

        fw = macro("test", [
          {title: "one", task: simple("test", function() { exec1 = true; throw new Error(); })},
          {title: "two", task: simple("test", function() { exec2 = true; })}
        ]);

        assert(fw("test", "Test error.") === undefined);
        exec1.must.be.eq(true);
        exec2.must.be.eq(true);

        runner.reporters.spy.called("start()").must.be.eq(3);
        args = runner.reporters.spy.getArguments("start()", 0);
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("TaskMacro");
        args  = runner.reporters.spy.getArguments("start()", 1);
        args[0].must.be.eq("one");
        args[1].must.be.instanceOf("SimpleTask");
        args  = runner.reporters.spy.getArguments("start()", 2);
        args[0].must.be.eq("two");
        args[1].must.be.instanceOf("SimpleTask");

        runner.reporters.spy.called("end()").must.be.eq(3);
        args = runner.reporters.spy.getArguments("end()", 0);
        args.length.must.be.eq(5);
        args[0].must.be.instanceOf("SimpleTask");
        args[1].must.be.instanceOf("ResultState");
        args[1].must.be.eq("FAILED");
        args[2].must.be.instanceOf(Error);
        args[3].must.be.instanceOf("Number");
        args[4].must.be.instanceOf("Number");
        args = runner.reporters.spy.getArguments("end()", 1);
        args.length.must.be.eq(5);
        args[0].must.be.instanceOf("SimpleTask");
        args[1].must.be.instanceOf("ResultState");
        args[1].must.be.eq("OK");
        assert(args[2] === undefined);
        args[3].must.be.instanceOf("Number");
        args[4].must.be.instanceOf("Number");
        args = runner.reporters.spy.getArguments("end()", 2);
        args.length.must.be.eq(1);
        args[0].must.be.instanceOf("TaskMacro");

        runner.reporters.spy.called("ignore()").must.be.eq(0);

        runner.loggers.spy.called("debug()").must.be.eq(6);
        runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
        runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting sync run of simple task 'one'."]);
        runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended sync run of simple task 'one' in 'FAILED' state."]);
        runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Starting sync run of simple task 'two'."]);
        runner.loggers.spy.getArguments("debug()", 4).must.be.eq(["Ended sync run of simple task 'two' in 'OK' state."]);
        runner.loggers.spy.getArguments("debug()", 5).must.be.eq(["Ended run of macro 'test'."]);
      });

      it("Failed - break on error", function() {
        var args, fw, exec1, exec2;

        runner = new Runner({loggers, reporters, console, onError: "break"});
        macro = runner.macro;
        simple = runner.simple;

        fw = macro("test", [
          {title: "one", task: simple("test", function() { exec1 = true; throw new Error(); })},
          {title: "two", task: simple("test", function() { exec2 = true; })}
        ]);

        assert(fw("test", "Test error.") === undefined);
        exec1.must.be.eq(true);
        assert(exec2 === undefined);

        runner.reporters.spy.called("start()").must.be.eq(2);
        args = runner.reporters.spy.getArguments("start()", 0);
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("TaskMacro");
        args  = runner.reporters.spy.getArguments("start()", 1);
        args[0].must.be.eq("one");
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
        args[0].must.be.instanceOf("TaskMacro");

        runner.reporters.spy.called("ignore()").must.be.eq(0);

        runner.loggers.spy.called("debug()").must.be.eq(4);
        runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting run of macro 'test'."]);
        runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Starting sync run of simple task 'one'."]);
        runner.loggers.spy.getArguments("debug()", 2).must.be.eq(["Ended sync run of simple task 'one' in 'FAILED' state."]);
        runner.loggers.spy.getArguments("debug()", 3).must.be.eq(["Ended run of macro 'test' on error."]);
      });
    });
  });
});
