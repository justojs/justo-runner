//imports
const assert = require("assert");
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const FileMacro = PKG.FileMacro;
const Runner = PKG.Runner;

//suite
describe("FileMacro (runner)", function() {
  var runner, reporters, macro, simple;

  beforeEach(function() {
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = new Runner({reporters, console});
    macro = runner.macro;
  });

  describe("#Runner.macro()", function() {
    it("macro()", function() {
      macro.must.raise("Invalid number of arguments. At least, two: name and array or object.");
    });

    it("macro(name)", function() {
      macro.must.raise("Invalid number of arguments. At least, two: name and array or object.", ["test"]);
    });

    it("macro(opts, {src, require})", function() {
      var fw = macro("test", {src: "one.js", require: "two.js"});

      fw.must.be.instanceOf(Function);
      fw.__task__.must.be.instanceOf("FileMacro");
      fw.__task__.name.must.be.eq("test");
      fw.__task__.src.must.be.eq(["one.js"]);
      fw.__task__.require.must.be.eq(["two.js"]);
    });
  });

  describe("Wrapper call", function() {
    it("call()", function() {
      var fw = macro("test", {});
      assert(fw() === undefined);
    });

    it("call(title)", function() {
      var fw = macro("test", {});
      assert(fw("test") === undefined);
    });

    it("call(title) - file existing", function() {
      var fw = macro("test", {src: "test/unit/data/valid.js"});
      assert(fw("test") === undefined);
    });

    it("call(title) - file not existing", function() {
      var fw = macro("test", {src: "test/unit/data/unknown.js"});
      assert(fw("test") === undefined);
    });

    it("call(title) - file with syntax error", function() {
      var fw = macro("test", {src: "test/unit/data/invalid.js"});
      assert(fw("test") === undefined);
    });
  });

  describe("#Runner.runFileMacro()", function() {
    beforeEach(function() {
      reporters = spy({}, ["start() {}", "end() {}", "ignore() {}"]);
      runner = new Runner({reporters, console});
      macro = runner.macro;
    });

    describe("Ignore", function() {
      it("Explicitly", function() {
        var args, fw;

        fw = macro("test", {src: "test/unit/data/valid.js"});
        assert(fw.ignore("test") === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(1);

        args = runner.reporters.spy.getArguments("ignore()");
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("FileMacro");
      });

      it("Implicitly", function() {
        var args, fw;

        fw = macro({name: "test", ignore: true}, {src: "test/unit/data/valid.js"});
        assert(fw("test") === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(1);

        args = runner.reporters.spy.getArguments("ignore()");
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("FileMacro");
      });
    });

    describe("Mute", function() {
      it("Explicitly", function() {
        var fw = macro("test", {src: "test/unit/data/valid.js"});

        assert(fw.mute("test") === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(0);
      });

      it("Implicitly", function() {
        var fw = macro({name: "test", mute: true}, {src: "test/unit/data/valid.js"});

        assert(fw("test") === undefined);

        runner.reporters.spy.called("start()").must.be.eq(0);
        runner.reporters.spy.called("end()").must.be.eq(0);
        runner.reporters.spy.called("ignore()").must.be.eq(0);
      });
    });

    describe("Result", function() {
      it("Ok", function() {
        var args, fw = macro("test", {src: "test/unit/data/valid.js"});

        assert(fw("test") === undefined);

        runner.reporters.spy.called("start()").must.be.eq(2);
        args = runner.reporters.spy.getArguments("start()", 0);
        args[0].must.be.eq("test");
        args[1].must.be.instanceOf("FileMacro");
        args  = runner.reporters.spy.getArguments("start()", 1);
        args[0].must.be.eq("test/unit/data/valid.js");
        args[1].must.be.instanceOf("Workflow");
        //
        runner.reporters.spy.called("end()").must.be.eq(2);
        args = runner.reporters.spy.getArguments("end()", 0);
        args.length.must.be.eq(5);
        args[0].must.be.instanceOf("Workflow");
        args[1].must.be.instanceOf("ResultState");
        args[1].must.be.eq("OK");
        assert(args[2] === undefined);
        args[3].must.be.instanceOf("Number");
        args[4].must.be.instanceOf("Number");
        args = runner.reporters.spy.getArguments("end()", 1);
        args.length.must.be.eq(1);
        args[0].must.be.instanceOf("FileMacro");

        runner.reporters.spy.called("ignore()").must.be.eq(0);
      });

      describe("Failed", function() {
        it("Failed - file not existing", function() {
          var args, fw;

          fw = macro("test", {src: "test/unit/data/unknown.js"});
          assert(fw("test") === undefined);

          runner.reporters.spy.called("start()").must.be.eq(2);
          args = runner.reporters.spy.getArguments("start()", 0);
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("FileMacro");
          args  = runner.reporters.spy.getArguments("start()", 1);
          args[0].must.be.eq("test/unit/data/unknown.js");
          args[1].must.be.instanceOf("Workflow");

          runner.reporters.spy.called("end()").must.be.eq(2);
          args = runner.reporters.spy.getArguments("end()", 0);
          args.length.must.be.eq(5);
          args[0].must.be.instanceOf("Workflow");
          args[1].must.be.instanceOf("ResultState");
          args[1].must.be.eq("FAILED");
          args[2].must.be.instanceOf(Error);
          args[3].must.be.instanceOf("Number");
          args[4].must.be.instanceOf("Number");
          args = runner.reporters.spy.getArguments("end()", 1);
          args.length.must.be.eq(1);
          args[0].must.be.instanceOf("FileMacro");

          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });

        it("Failed - continue on error", function() {
          var args, fw;

          fw = macro("test", {src: ["test/unit/data/invalid.js", "test/unit/data/valid.js"]});
          assert(fw("test") === undefined);

          runner.reporters.spy.called("start()").must.be.eq(3);
          args = runner.reporters.spy.getArguments("start()", 0);
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("FileMacro");
          args  = runner.reporters.spy.getArguments("start()", 1);
          args[0].must.be.eq("test/unit/data/invalid.js");
          args[1].must.be.instanceOf("Workflow");
          args  = runner.reporters.spy.getArguments("start()", 2);
          args[0].must.be.eq("test/unit/data/valid.js");
          args[1].must.be.instanceOf("Workflow");

          runner.reporters.spy.called("end()").must.be.eq(3);
          args = runner.reporters.spy.getArguments("end()", 0);
          args.length.must.be.eq(5);
          args[0].must.be.instanceOf("Workflow");
          args[1].must.be.instanceOf("ResultState");
          args[1].must.be.eq("FAILED");
          args[2].must.be.instanceOf(Error);
          args[3].must.be.instanceOf("Number");
          args[4].must.be.instanceOf("Number");
          args = runner.reporters.spy.getArguments("end()", 1);
          args.length.must.be.eq(5);
          args[0].must.be.instanceOf("Workflow");
          args[1].must.be.instanceOf("ResultState");
          args[1].must.be.eq("OK");
          assert(args[2] === undefined);
          args[3].must.be.instanceOf("Number");
          args[4].must.be.instanceOf("Number");
          args = runner.reporters.spy.getArguments("end()", 2);
          args.length.must.be.eq(1);
          args[0].must.be.instanceOf("FileMacro");

          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });

        it("Failed - break on error", function() {
          var args, fw;

          reporters = spy({}, ["start() {}", "end() {}", "ignore() {}"]);
          runner = new Runner({reporters, console, onError: "break"});
          macro = runner.macro;

          fw = macro("test", {src: ["test/unit/data/invalid.js", "test/unit/data/valid.js"]});
          assert(fw("test") === undefined);

          runner.reporters.spy.called("start()").must.be.eq(2);
          args = runner.reporters.spy.getArguments("start()", 0);
          args[0].must.be.eq("test");
          args[1].must.be.instanceOf("FileMacro");
          args  = runner.reporters.spy.getArguments("start()", 1);
          args[0].must.be.eq("test/unit/data/invalid.js");
          args[1].must.be.instanceOf("Workflow");

          runner.reporters.spy.called("end()").must.be.eq(2);
          args = runner.reporters.spy.getArguments("end()", 0);
          args.length.must.be.eq(5);
          args[0].must.be.instanceOf("Workflow");
          args[1].must.be.instanceOf("ResultState");
          args[1].must.be.eq("FAILED");
          args[2].must.be.instanceOf(Error);
          args[3].must.be.instanceOf("Number");
          args[4].must.be.instanceOf("Number");
          args = runner.reporters.spy.getArguments("end()", 1);
          args.length.must.be.eq(1);
          args[0].must.be.instanceOf("FileMacro");

          runner.reporters.spy.called("ignore()").must.be.eq(0);
        });
      });
    });
  });
});
