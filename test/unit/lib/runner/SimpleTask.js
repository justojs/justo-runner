//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const SimpleTask = PKG.SimpleTask;
const Runner = PKG.Runner;

//suite
describe("SimpleTask (runner)", function() {
  var runner, simple, reporters;

  beforeEach(function() {
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = new Runner({reporters, console});
    simple = runner.simple;
  });

  describe("#Runner.simple()", function() {
    function fn() {}

    describe("New task", function() {
      it("simple(fn)", function() {
        var fw = simple(fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("SimpleTask");
        fw.__task__.name.must.be.eq("fn");
        fw.__task__.fn.must.be.same(fn);
      });

      it("simple(name, fn)", function() {
        var fw = simple("test", fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("SimpleTask");
        fw.__task__.name.must.be.eq("test");
        fw.__task__.fn.must.be.same(fn);
      });

      it("simple(opts, fn)", function() {
        var fw = simple({name: "test"}, fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("SimpleTask");
        fw.__task__.name.must.be.eq("test");
        fw.__task__.fn.must.be.same(fn);
      });
    });

    describe("From existing task", function() {
      it("simple(opts)", function() {
        var fw = simple({
          name: "test",
          params: {one: 1, two: 2},
          task: simple({name: "existing"}, fn)
        });

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Workflow");
        fw.__task__.name.must.be.eq("test");
        fw.__task__.fn.must.not.be.same(fn);
      });
    });
  });

  describe("Wrapper", function() {
    describe("For new task", function() {
      it("call()", function() {
        var pp, fw = simple(function(params) { pp = params; });
        fw();
        pp.must.be.eq([]);
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
        var inj, fw = simple(function(params) { inj = [params]; });
        fw("title", 1, 2, 3);
        inj[0].must.be.eq([1, 2, 3]);
      });
    });

    describe("For existing task", function() {
      it("call()", function() {
        var pp, fw = simple({
          name: "test",
          params: {one: 1, two: 2},
          task: simple(function(params) { pp = params; })
        });
        fw();
        pp.must.be.eq([{one: 1, two: 2}]);
      });

      it("call(title)", function() {
        var pp, fw = simple({
          name: "test",
          params: {one: 1, two: 2},
          task: simple(function(params) { pp = params; })
        });
        fw("the title");
        pp.must.be.eq([{one: 1, two: 2}]);
      });
    });
  });

  describe("#Runner.runSimpleTask()", function() {
    beforeEach(function() {
      reporters = spy({}, ["start() {}", "end() {}", "ignore() {}"]);
    });

    describe("#[runSyncSimpleTask]()", function() {
      describe("Ignore", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters,  console}));
          simple = runner.simple;
        });

        it("Explicitly", function() {
          var args, fw = simple(function sum(params) { return params[0] + params[1]; });

          assert(fw.ignore("test", 1, 2) === undefined);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(1);

          args = runner.reporters.spy.getArguments("ignore()");
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("SimpleTask");
        });

        it("Implicitly", function() {
          var args, fw = simple({ignore: true}, function sum(params) { return params[0] + params[1]; });

          assert(fw("test", 1, 2) === undefined);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(1);

          args = runner.reporters.spy.getArguments("ignore()");
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("SimpleTask");
        });
      });

      describe("Mute", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;
        });

        it("Explicitly", function() {
          var fw = simple(function sum(params) { return params[0] + params[1]; });

          fw.mute("test", 1, 2).must.be.eq(3);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });

        it("Implicitly", function() {
          var fw = simple({mute: true}, function sum(params) { return params[0] + params[1]; });

          fw("test", 1, 2).must.be.eq(3);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });
      });

      describe("OK", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;
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
        });
      });

      describe("Failed", function() {
        it("Failed - continue on error", function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;

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
        });

        it("Failed - break on error", function() {
          runner = new Runner({reporters, console, onError: "break"});
          simple = runner.simple;

          var fw = simple(function raise(params) { throw new Error(params[0]); });

          try {
            fw("test", "Test error.");
          } catch (e) {
            assert(true);
            e.must.be.instanceOf(Error);
          }

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
        });
      });
    });

    describe("#[runAsyncSimpleTask]()", function() {
      describe("Ignore", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;
        });

        it("Explicitly", function() {
          var args, fw = simple(function async(params, done) { done(); });

          assert(fw.ignore("test", 1, 2) === undefined);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(1);

          args = runner.reporters.spy.getArguments("ignore()");
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("SimpleTask");
        });

        it("Implicitly", function() {
          var args, fw = simple({ignore: true}, function async(params, done) { done(); });

          assert(fw("test", 1, 2) === undefined);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(1);

          args = runner.reporters.spy.getArguments("ignore()");
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("SimpleTask");
        });
      });

      describe("Mute", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;
        });

        it("Explicitly", function() {
          var res, fw = simple(function sum(params, done) {res = params[0] + params[1]; done(); });

          assert(fw.mute("test", 1, 2) === undefined);
          res.must.be.eq(3);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });

        it("Implicitly", function() {
          var res, fw = simple({mute: true}, function sum(params, done) { res = params[0] + params[1]; done(); });

          assert(fw("test", 1, 2) === undefined);
          res.must.be.eq(3);

          runner.reporters.spy.called("start()").must.be.eq(0);
          runner.reporters.spy.called("end()").must.be.eq(0);
          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });
      });

      describe("OK", function() {
        beforeEach(function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;
        });

        it("OK", function() {
          var res, fw = simple(function sum(params, done) { res = params[0] + params[1]; done(); });

          assert(fw("test", 1, 2) === undefined);
          res.must.be.eq(3);

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
        });
      });

      describe("Failed", function() {
        it("Failed - continue on error", function() {
          runner = spy(new Runner({reporters, console}));
          simple = runner.simple;

          var fw = simple(function raise(params, done) { done(new Error(params[0])); });

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
        });

        it("Failed - break on error", function() {
          runner = spy(new Runner({reporters, console, onError: "break"}));
          simple = runner.simple;

          var fw = simple(function raise(params, done) { done(new Error(params[0])); });

          try {
            fw("test", "Test error.");
            assert(true);
          } catch (e) {
            e.must.be.instanceOf(Error);
          }

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
        });
      });
    });
  });
});
