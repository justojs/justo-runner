//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const PKG = require("../../../../dist/es5/nodejs/justo-runner");
const Tester = PKG.Runner;
const Suite = PKG.Suite;

//suite
describe("Test (runner)", function() {
  var runner, suite, init, fin, test, loggers, reporters;
  var fn;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = spy(new Tester({loggers, reporters, console}));
    suite = runner.suite;
    init = runner.init;
    fin = runner.fin;
    test = runner.test;
    fn = spy(function() {});
  });

  describe("#test()", function() {
    describe("outside suite", function() {
      it("test()", function() {
        (function() {
          var fw = test();
        }).must.raise("test() must be invoked into a suite.");
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

      describe("#wrapper.XXX()", function() {
        var fw;

        beforeEach(function() {
          fw = test(fn);
        });

        it("wrapper.ignore() exists", function() {
          fw.ignore.must.be.instanceOf(Function);
        });

        it("wrapper.only() exists", function() {
          fw.only.must.be.instanceOf(Function);
        });

        it("wrapper.mute() exists", function() {
          fw.mute.must.be.instanceOf(Function);
        });
      });

      it("test()", function() {
        test.must.raise("Invalid number of arguments. At least, one expected: the test function.");
      });

      describe("Synchronous", function() {
        it("test(fn)", function() {
          var fw = test(fn);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "anonymous test",
            desc: undefined
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.fn.must.be.same(fn);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
          fn.spy.called().must.be.eq(0);
        });

        it("test(opts, fn)", function() {
          var fw = test({desc: "Description."}, fn);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "anonymous test",
            desc: "Description."
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.fn.must.be.same(fn);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
          fn.spy.called().must.be.eq(0);
        });

        it("test(name, fn)", function() {
          var fw = test("mytest", fn);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "mytest",
            desc: undefined
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.fn.must.be.same(fn);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
          fn.spy.called().must.be.eq(0);
        });
      });

      describe("Asynchronous", function() {
        function async(done) { done(); }

        it("test(fn)", function() {
          var fw = test(async);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "anonymous test",
            desc: undefined
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.sync.must.be.eq(false);
          fw.__task__.fn.__task__.async.must.be.eq(true);
          fw.__task__.fn.__task__.fn.must.be.same(async);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
        });

        it("test(opts, fn)", function() {
          var fw = test({desc: "Description."}, async);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "anonymous test",
            desc: "Description."
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.sync.must.be.eq(false);
          fw.__task__.fn.__task__.async.must.be.eq(true);
          fw.__task__.fn.__task__.fn.must.be.same(async);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
        });

        it("test(name, fn)", function() {
          var fw = test("mytest", async);

          fw.must.be.instanceOf(Function);
          fw.__task__.must.be.instanceOf("Test");
          fw.__task__.must.have({
            ns: undefined,
            name: "mytest",
            desc: undefined
          });
          fw.__task__.fn.must.be.instanceOf(Function);
          fw.__task__.fn.__task__.must.be.instanceOf("SimpleTask");
          fw.__task__.fn.__task__.sync.must.be.eq(false);
          fw.__task__.fn.__task__.async.must.be.eq(true);
          fw.__task__.fn.__task__.fn.must.be.same(async);
          fw.ignore.must.be.instanceOf(Function);
          fw.mute.must.be.instanceOf(Function);
        });
      });
    });
  });

  describe("#initializers", function() {
    var suite;

    beforeEach(function() {
      suite = new Suite({name: "suite"});
      runner.stack.push(suite);
    });

    afterEach(function() {
      runner.stack.pop();
    });

    it("initializers - none", function() {
      var fw = test("mytest", function() {});
      fw.__task__.initializers.must.be.eq([]);
    });

    it("initializers - only for each", function() {
      var ifw1, ifw2, tfw;

      ifw1 = init("*", function() {});
      ifw2 = init("*", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.initializers.must.be.eq([ifw1, ifw2]);
    });

    it("initializers - only specific ones", function() {
      var ifw1, ifw2, tfw;

      ifw1 = init("mytest", function() {});
      ifw2 = init("mytest", function() {});
      init("mytest2", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.initializers.must.be.eq([ifw1, ifw2]);
    });

    it("initializers - both", function() {
      var ifw1, ifw2, ifw3, ifw4, tfw;

      ifw1 = init("*", function() {});
      ifw2 = init("*", function() {});
      ifw3 = init("mytest", function() {});
      ifw4 = init("mytest", function() {});
      init("mytest2", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.initializers.must.be.eq([ifw1, ifw2, ifw3, ifw4]);
    });
  });

  describe("#finalizers", function() {
    var suite;

    beforeEach(function() {
      suite = new Suite({name: "suite"});
      runner.stack.push(suite);
    });

    afterEach(function() {
      runner.stack.pop();
    });

    it("finalizers - none", function() {
      var fw = test("mytest", function() {});
      fw.__task__.finalizers.must.be.eq([]);
    });

    it("finalizers - only for each", function() {
      var ffw1, ffw2, tfw;

      ffw1 = fin("*", function() {});
      ffw2 = fin("*", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.finalizers.must.be.eq([ffw1, ffw2]);
    });

    it("finalizers - only specific ones", function() {
      var ffw1, ffw2, tfw;

      ffw1 = fin("mytest", function() {});
      ffw2 = fin("mytest", function() {});
      fin("mytest2", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.finalizers.must.be.eq([ffw1, ffw2]);
    });

    it("finalizers - both", function() {
      var ffw1, ffw2, ffw3, ffw4, tfw;

      ffw1 = fin("*", function() {});
      ffw2 = fin("*", function() {});
      ffw3 = fin("mytest", function() {});
      ffw4 = fin("mytest", function() {});
      fin("mytest2", function() {});
      tfw = test("mytest", function() {});

      tfw.__task__.finalizers.must.be.eq([ffw1, ffw2, ffw3, ffw4]);
    });
  });

  describe("#runTest()", function() {
    var suite, init1, init2, init3, init4, fin1, fin2, fin3, fin4;

    beforeEach(function() {
      runner.spy.monitor("runTest()");
    });

    beforeEach(function() {
      suite = new Suite({name: "suite"});
      runner.stack.push(suite);
      init("*", init1 = spy(function() {}));
      init("*", init2 = spy(function() {}));
      init("mytest", init3 = spy(function() {}));
      init("mytest", init4 = spy(function() {}));
      fin("*", fin1 = spy(function() {}));
      fin("*", fin2 = spy(function() {}));
      fin("mytest", fin3 = spy(function() {}));
      fin("mytest", fin4 = spy(function() {}));
    });

    afterEach(function() {
      runner.stack.pop();
    });

    describe("Synchronous", function() {
      it("OK", function() {
        var fw = test("mytest", fn);
        fw();
        runner.spy.called("runTest()").must.be.eq(1);
        init1.spy.called().must.be.eq(1);
        init2.spy.called().must.be.eq(1);
        init3.spy.called().must.be.eq(1);
        init4.spy.called().must.be.eq(1);
        fn.spy.called().must.be.eq(1);
        fin1.spy.called().must.be.eq(1);
        fin2.spy.called().must.be.eq(1);
        fin3.spy.called().must.be.eq(1);
        fin4.spy.called().must.be.eq(1);
      });
    });

    describe("Asynchronous", function() {
      it("OK", function() {
        var invoked = false;
        function async(done) { done(); invoked = true; }

        var fw = test("mytest", async);
        fw();
        runner.spy.called("runTest()").must.be.eq(1);
        init1.spy.called().must.be.eq(1);
        init2.spy.called().must.be.eq(1);
        init3.spy.called().must.be.eq(1);
        init4.spy.called().must.be.eq(1);
        invoked.must.be.eq(true);
        fin1.spy.called().must.be.eq(1);
        fin2.spy.called().must.be.eq(1);
        fin3.spy.called().must.be.eq(1);
        fin4.spy.called().must.be.eq(1);
      });
    });

    describe("ignore", function() {
      it("no ignore", function() {
        var fw = test("mytest", fn);
        fw();
        fn.spy.called().must.be.eq(1);
      });

      it("ignore: false", function() {
        var fw = test({name: "mytest", ignore: false}, fn);
        fw();
        fn.spy.called().must.be.eq(1);
      });

      it("ignore: true", function() {
        var fw = test({name: "mytest", ignore: true}, fn);
        fw();
        fn.spy.called().must.be.eq(0);
      });
    });
  });

  it("test.only()", function() {
    suite(function() {
      test.only(function() {}).__task__.must.have({only: true, ignore: false});
    });
  });
});
