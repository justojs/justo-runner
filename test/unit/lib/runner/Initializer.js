//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const Tester = PKG.Runner;
const Suite = PKG.Suite;

//suite
describe("Initializer (runner)", function() {
  var runner, init, reporters;
  var fn;

  beforeEach(function() {
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = spy(new Tester({reporters, console}));
    init = runner.init;
    fn = spy(function() {});
  });

  describe("#init()", function() {
    describe("outside suite", function() {
      it("init()", function() {
        (function() {
          var fw = init();
        }).must.raise("init() must be invoked into a suite.");
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

      it("init()", function() {
        init.must.raise("Invalid number of arguments. At least, one expected: the init function.");
      });

      it("init(fn)", function() {
        var fw = init(fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Initializer");
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

      it("init(opts, fn)", function() {
        var fw = init({desc: "Description."}, fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Initializer");
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

      it("init(name, fn) - foreach", function() {
        var fw = init("*", fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Initializer");
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

      it("init(name, fn) - test", function() {
        var fw = init("test", fn);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Initializer");
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

  describe("#forEachInitializers", function() {
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

      it("forEachInitializers", function() {
        init("*", fn0);
        init("*", fn1);

        root.forEachInitializers.length.must.be.eq(2);
        root.forEachInitializers[0].__task__.fn.must.be.same(fn0);
        root.forEachInitializers[1].__task__.fn.must.be.same(fn1);
      });
    });

    describe("Child", function() {
      var parent, child;

      afterEach(function() {
        runner.stack.clear();
      });

      it("forEachInitializers", function() {
        parent = new Suite({name: "parent"});
        runner.stack.push(parent);
        init("*", fn0);
        init("*", fn1);

        child = new Suite({name: "child"});
        child._parent = parent;
        runner.stack.push(child);
        init("*", fn2);
        init("*", fn3);

        child.forEachInitializers.length.must.be.eq(4);
        child.forEachInitializers[0].__task__.fn.must.be.same(fn0);
        child.forEachInitializers[1].__task__.fn.must.be.same(fn1);
        child.forEachInitializers[2].__task__.fn.must.be.same(fn2);
        child.forEachInitializers[3].__task__.fn.must.be.same(fn3);
      });
    });

    describe("Grandson", function() {
      var parent, child, gson;

      afterEach(function() {
        runner.stack.clear();
      });

      it("forEachInitializers", function() {
        parent = new Suite({name: "parent"});
        runner.stack.push(parent);
        init("*", fn0);
        init("*", fn1);

        child = new Suite({name: "child"});
        child._parent = parent;
        runner.stack.push(child);
        init("*", fn2);
        init("*", fn3);

        gson = new Suite({name: "gson"});
        gson._parent = child;
        runner.stack.push(gson);
        init("*", fn4);
        init("*", fn5);

        gson.forEachInitializers.length.must.be.eq(6);
        gson.forEachInitializers[0].__task__.fn.must.be.same(fn0);
        gson.forEachInitializers[1].__task__.fn.must.be.same(fn1);
        gson.forEachInitializers[2].__task__.fn.must.be.same(fn2);
        gson.forEachInitializers[3].__task__.fn.must.be.same(fn3);
        gson.forEachInitializers[4].__task__.fn.must.be.same(fn4);
        gson.forEachInitializers[5].__task__.fn.must.be.same(fn5);
      });
    });
  });

  describe("#runInit()", function() {
    var suite;

    beforeEach(function() {
      runner.spy.monitor("runInit()");
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
      var fw = init(fn);
      fw();
      runner.spy.called("runInit()").must.be.eq(1);
      runner.spy.called("runSimpleTask()").must.be.eq(1);
      fn.spy.called().must.be.eq(1);
    });
  });
});
