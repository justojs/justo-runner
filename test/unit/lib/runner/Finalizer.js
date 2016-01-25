//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const Tester = PKG.Runner;
const Suite = PKG.Suite;

//suite
describe("Finalizer (runner)", function() {
  var runner, fin, loggers, reporters;
  var fn;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = spy(new Tester({loggers, reporters}));
    fin = runner.fin;
    fn = spy(function() {});
  });

  describe("#fin()", function() {
    describe("outside suite", function() {
      it("fin()", function() {
        (function() {
          var fw = fin();
        }).must.raise("fin() must be invoked into a suite.");
      });
    });

    describe("inside suite", function() {
      var suite;

      beforeEach(function() {
        suite = new Suite({name: "suite"});
        runner.stack.push(suite);
      });

      afterEach(function() {
        runner.stack.pop();
      });

      it("fin()", function() {
        fin.must.raise("Invalid number of arguments. At least, one expected: the fin function.");
      });

      it("fin(fn)", function() {
        var fw = fin(fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Finalizer");
        fw.__task__.must.have({
          namespace: undefined,
          name: "__suite__",
          description: undefined
        });
        fw.__task__.fn.must.be.same(fn);
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        fn.spy.called().must.be.eq(0);
      });

      it("fin(opts, fn)", function() {
        var fw = fin({desc: "Description."}, fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Finalizer");
        fw.__task__.must.have({
          namespace: undefined,
          name: "__suite__",
          description: "Description."
        });
        fw.__task__.fn.must.be.same(fn);
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        fn.spy.called().must.be.eq(0);
      });

      it("fin(name, fn) - foreach", function() {
        var fw = fin("*", fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Finalizer");
        fw.__task__.must.have({
          namespace: undefined,
          name: "*",
          description: undefined
        });
        fw.__task__.fn.must.be.same(fn);
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        fn.spy.called().must.be.eq(0);
      });

      it("fin(name, fn) - test", function() {
        var fw = fin("test", fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Finalizer");
        fw.__task__.must.have({
          namespace: undefined,
          name: "test",
          description: undefined
        });
        fw.__task__.fn.must.be.same(fn);
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        fn.spy.called().must.be.eq(0);
      });
    });
  });

  describe("#forEachFinalizers", function() {
    function fn0() {}
    function fn1() {}
    function fn2() {}
    function fn3() {}
    function fn4() {}
    function fn5() {}

    describe("Root", function() {
      var root;

      beforeEach(function() {
        root = new Suite({name: "root"});
        runner.stack.push(root);
      });

      afterEach(function() {
        runner.stack.clear();
      });

      it("forEachFinalizers", function() {
        fin("*", fn0);
        fin("*", fn1);

        root.forEachFinalizers.length.must.be.eq(2);
        root.forEachFinalizers[0].__task__.fn.must.be.same(fn0);
        root.forEachFinalizers[1].__task__.fn.must.be.same(fn1);
      });
    });

    describe("Child", function() {
      var parent, child;

      afterEach(function() {
        runner.stack.clear();
      });

      it("forEachFinalizers", function() {
        parent = new Suite({name: "parent"});
        runner.stack.push(parent);
        fin("*", fn0);
        fin("*", fn1);

        child = new Suite({name: "child"});
        child._parent = parent;
        runner.stack.push(child);
        fin("*", fn2);
        fin("*", fn3);

        child.forEachFinalizers.length.must.be.eq(4);
        child.forEachFinalizers[0].__task__.fn.must.be.same(fn0);
        child.forEachFinalizers[1].__task__.fn.must.be.same(fn1);
        child.forEachFinalizers[2].__task__.fn.must.be.same(fn2);
        child.forEachFinalizers[3].__task__.fn.must.be.same(fn3);
      });
    });

    describe("Grandson", function() {
      var parent, child, gson;

      afterEach(function() {
        runner.stack.clear();
      });

      it("forEachFinalizers", function() {
        parent = new Suite({name: "parent"});
        runner.stack.push(parent);
        fin("*", fn0);
        fin("*", fn1);

        child = new Suite({name: "child"});
        child._parent = parent;
        runner.stack.push(child);
        fin("*", fn2);
        fin("*", fn3);

        gson = new Suite({name: "gson"});
        gson._parent = child;
        runner.stack.push(gson);
        fin("*", fn4);
        fin("*", fn5);

        gson.forEachFinalizers.length.must.be.eq(6);
        gson.forEachFinalizers[0].__task__.fn.must.be.same(fn0);
        gson.forEachFinalizers[1].__task__.fn.must.be.same(fn1);
        gson.forEachFinalizers[2].__task__.fn.must.be.same(fn2);
        gson.forEachFinalizers[3].__task__.fn.must.be.same(fn3);
        gson.forEachFinalizers[4].__task__.fn.must.be.same(fn4);
        gson.forEachFinalizers[5].__task__.fn.must.be.same(fn5);
      });
    });
  });

  describe("#runFin()", function() {
    var suite;

    beforeEach(function() {
      runner.spy.monitor("runFin()");
      runner.spy.monitor("runSimpleTask()");
    });

    beforeEach(function() {
      suite = new Suite({name: "suite"});
      runner.stack.push(suite);
    });

    afterEach(function() {
      runner.stack.pop();
    });

    it("call", function() {
      var fw = fin(fn);
      fw();
      runner.spy.called("runFin()").must.be.eq(1);
      runner.spy.called("runSimpleTask()").must.be.eq(1);
      fn.spy.called().must.be.eq(1);
    });
  });
});
