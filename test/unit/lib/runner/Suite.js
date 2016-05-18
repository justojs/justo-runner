//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Tester = require("../../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Suite (runner)", function() {
  var runner, suite, init, fin, test, loggers, reporters;
  function fn() {}

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
    runner = spy(new Tester({loggers, reporters, console}));
    suite = runner.suite;
    init = runner.init;
    fin = runner.fin;
    test = runner.test;
  });

  describe("#suite()", function() {
    var def;

    beforeEach(function() {
      def = spy(function() {});
    });

    describe("Root", function() {
      it("suite()", function() {
        suite.must.raise("Invalid number of arguments. Expected, at least, the definition function.");
        runner.stack.length.must.be.eq(0);
      });

      it("suite(def)", function() {
        var fw = suite(def);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Suite");
        fw.__task__.must.have({
          parent: undefined,
          ns: undefined,
          name:  "anonymous suite",
          desc: undefined,
          initializers: [],
          finalizers: [],
          forEachInitializers: [],
          forEachFinalizers: [],
          testInitializers: [],
          testFinalizers: [],
          tasks: []
        });
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        def.spy.called().must.be.eq(1);
        runner.stack.length.must.be.eq(0);
      });

      it("suite(name, def)", function() {
        var fw = suite("mysuite", def);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Suite");
        fw.__task__.must.have({
          parent: undefined,
          ns: undefined,
          name:  "mysuite",
          desc: undefined,
          initializers: [],
          finalizers: [],
          forEachInitializers: [],
          forEachFinalizers: [],
          testInitializers: [],
          testFinalizers: [],
          tasks: []
        });
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        def.spy.called().must.be.eq(1);
        runner.stack.length.must.be.eq(0);
      });

      it("suite(opts, def)", function() {
        var fw = suite({name: "mysuite", desc: "The description."}, def);

        fw.must.be.instanceOf(Function);
        fw.__task__.must.be.instanceOf("Suite");
        fw.__task__.must.have({
          parent: undefined,
          ns: undefined,
          name:  "mysuite",
          desc: "The description.",
          initializers: [],
          finalizers: [],
          forEachInitializers: [],
          forEachFinalizers: [],
          testInitializers: [],
          testFinalizers: [],
          tasks: []
        });
        fw.ignore.must.be.instanceOf(Function);
        fw.mute.must.be.instanceOf(Function);
        def.spy.called().must.be.eq(1);
        runner.stack.length.must.be.eq(0);
      });
    });

    it("Child", function() {
      var prnt, chld;

      prnt = suite("parent", function() {
        chld = suite("child", def);
      });

      prnt.must.be.instanceOf(Function);
      prnt.__task__.must.be.instanceOf("Suite");
      prnt.__task__.must.have({
        parent: undefined,
        ns: undefined,
        name: "parent",
        desc: undefined,
        initializers: [],
        finalizers: [],
        forEachInitializers: [],
        forEachFinalizers: [],
        testInitializers: [],
        testFinalizers: []
      });
      prnt.__task__.tasks.length.must.be.eq(1);
      prnt.__task__.tasks[0].must.be.same(chld);

      chld.must.be.instanceOf(Function);
      chld.__task__.must.be.instanceOf("Suite");
      chld.__task__.parent.must.be.same(prnt.__task__);
      chld.__task__.must.have({
        ns: undefined,
        name: "child",
        desc: undefined,
        initializers: [],
        finalizers: [],
        forEachInitializers: [],
        forEachFinalizers: [],
        testInitializers: [],
        testFinalizers: [],
        tasks: []
      });
      def.spy.called().must.be.eq(1);

      runner.stack.length.must.be.eq(0);
    });

    it("Grandson", function() {
      var prnt, chld, gson;

      prnt = suite("parent", function() {
        chld = suite("child", function() {
          gson = suite("grandson", def);
        });
      });

      prnt.must.be.instanceOf(Function);
      prnt.__task__.must.be.instanceOf("Suite");
      prnt.__task__.must.have({
        parent: undefined,
        ns: undefined,
        name: "parent",
        desc: undefined,
        initializers: [],
        finalizers: [],
        forEachInitializers: [],
        forEachFinalizers: [],
        testInitializers: [],
        testFinalizers: []
      });
      prnt.__task__.tasks.length.must.be.eq(1);
      prnt.__task__.tasks[0].must.be.same(chld);

      chld.must.be.instanceOf(Function);
      chld.__task__.must.be.instanceOf("Suite");
      chld.__task__.parent.must.be.same(prnt.__task__);
      chld.__task__.must.have({
        ns: undefined,
        name: "child",
        desc: undefined,
        initializers: [],
        finalizers: [],
        forEachInitializers: [],
        forEachFinalizers: [],
        testInitializers: [],
        testFinalizers: []
      });
      chld.__task__.tasks.length.must.be.eq(1);
      chld.__task__.tasks[0].must.be.same(gson);

      gson.must.be.instanceOf(Function);
      gson.__task__.must.be.instanceOf("Suite");
      gson.__task__.parent.must.be.same(chld.__task__);
      gson.__task__.must.have({
        ns: undefined,
        name: "grandson",
        desc: undefined,
        initializers: [],
        finalizers: [],
        forEachInitializers: [],
        forEachFinalizers: [],
        testInitializers: [],
        testFinalizers: [],
        tasks: []
      });

      def.spy.called().must.be.eq(1);
      runner.stack.length.must.be.eq(0);
    });
  });

  describe("Items", function() {
    var op1, op2;

    beforeEach(function() {
      op1 = spy(function() {});
      op2 = spy(function() {});
    });

    describe("Initializers", function() {
      it("Initializer of suite", function() {
        var sfw, ifw1, ifw2;

        sfw = suite("suite", function() {
          ifw1 = init(op1);
          ifw2 = init(op2);
        });

        sfw.__task__.initializers.length.must.be.eq(2);
        sfw.__task__.initializers[0].must.be.same(ifw1);
        sfw.__task__.initializers[1].must.be.same(ifw2);
        sfw.__task__.forEachInitializers.length.must.be.eq(0);
        sfw.__task__.testInitializers.length.must.be.eq(0);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });

      it("Initializers for each test", function() {
        var sfw, ifw1, ifw2;

        sfw = suite("suite", function() {
          ifw1 = init("*", op1);
          ifw2 = init("*", op2);
        });

        sfw.__task__.initializers.length.must.be.eq(0);
        sfw.__task__.forEachInitializers.length.must.be.eq(2);
        sfw.__task__.forEachInitializers[0].must.be.same(ifw1);
        sfw.__task__.forEachInitializers[1].must.be.same(ifw2);
        sfw.__task__.testInitializers.length.must.be.eq(0);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });

      it("Initializers for specific tests", function() {
        var sfw, ifw1, ifw2;

        sfw = suite("suite", function() {
          ifw1 = init("test1", op1);
          ifw2 = init("test2", op2);
        });

        sfw.__task__.initializers.length.must.be.eq(0);
        sfw.__task__.forEachInitializers.length.must.be.eq(0);
        sfw.__task__.testInitializers.length.must.be.eq(2);
        sfw.__task__.testInitializers[0].must.be.same(ifw1);
        sfw.__task__.testInitializers[1].must.be.same(ifw2);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });
    });

    describe("Finalizers", function() {
      it("Finalizer of suite", function() {
        var sfw, ffw1, ffw2;

        sfw = suite("suite", function() {
          ffw1 = fin(op1);
          ffw2 = fin(op2);
        });

        sfw.__task__.finalizers.length.must.be.eq(2);
        sfw.__task__.finalizers[0].must.be.same(ffw1);
        sfw.__task__.finalizers[1].must.be.same(ffw2);
        sfw.__task__.forEachFinalizers.length.must.be.eq(0);
        sfw.__task__.testFinalizers.length.must.be.eq(0);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });

      it("Finalizers for each test", function() {
        var sfw, ffw1, ffw2;

        sfw = suite("suite", function() {
          ffw1 = fin("*", op1);
          ffw2 = fin("*", op2);
        });

        sfw.__task__.finalizers.length.must.be.eq(0);
        sfw.__task__.forEachFinalizers.length.must.be.eq(2);
        sfw.__task__.forEachFinalizers[0].must.be.same(ffw1);
        sfw.__task__.forEachFinalizers[1].must.be.same(ffw2);
        sfw.__task__.testFinalizers.length.must.be.eq(0);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });

      it("Finalizers for specific tests", function() {
        var sfw, ffw1, ffw2;

        sfw = suite("suite", function() {
          ffw1 = fin("test1", op1);
          ffw2 = fin("test2", op2);
        });

        sfw.__task__.finalizers.length.must.be.eq(0);
        sfw.__task__.forEachFinalizers.length.must.be.eq(0);
        sfw.__task__.testFinalizers.length.must.be.eq(2);
        sfw.__task__.testFinalizers[0].must.be.same(ffw1);
        sfw.__task__.testFinalizers[1].must.be.same(ffw2);
        op1.spy.called().must.be.eq(0);
        op2.spy.called().must.be.eq(0);
      });
    });

    it("Tests", function() {
      var sfw, tfw1, tfw2;

      sfw = suite("suite", function() {
        tfw1 = test(op1);
        tfw2 = test(op2);
      });

      sfw.__task__.tasks.length.must.be.eq(2);
      sfw.__task__.tasks[0].must.be.same(tfw1);
      sfw.__task__.tasks[1].must.be.same(tfw2);
      op1.spy.called().must.be.eq(0);
      op2.spy.called().must.be.eq(0);
    });
  });

  describe("#runSuite()", function() {
    describe("!only", function() {
      beforeEach(function() {
        runner.spy.monitor("runSuite()");
      });

      it("runSuite()", function() {
        var fw, si1, si2, sf1, sf2,
            fei1, fei2, fef1, fef2,
            t1i1, t1i2, fn1, t1f1, t1f2,
            t2i1, t2i2, fn2, t2f1, t2f2;

        fw = suite(function() {
          init(si1 = spy(function() {}));
          init(si2 = spy(function() {}));
          fin(sf1 = spy(function() {}));
          fin(sf2 = spy(function() {}));
          init("*", fei1 = spy(function() {}));
          init("*", fei2 = spy(function() {}));
          fin("*", fef1 = spy(function() {}));
          fin("*", fef2 = spy(function() {}));
          init("mytest1", t1i1 = spy(function() {}));
          init("mytest1", t1i2 = spy(function() {}));
          fin("mytest1", t1f1 = spy(function() {}));
          fin("mytest1", t1f2 = spy(function() {}));
          test("mytest1", fn1 = spy(function() {}));
          init("mytest1", t2i1 = spy(function() {}));
          init("mytest1", t2i2 = spy(function() {}));
          fin("mytest1", t2f1 = spy(function() {}));
          fin("mytest1", t2f2 = spy(function() {}));
          test("mytest2", fn2 = spy(function() {}));
        });

        fw();

        //suite init/fin
        si1.spy.called().must.be.eq(1);
        si2.spy.called().must.be.eq(1);
        sf1.spy.called().must.be.eq(1);
        sf2.spy.called().must.be.eq(1);

        //foreach init/fin
        fei1.spy.called().must.be.eq(2);
        fei2.spy.called().must.be.eq(2);
        fef1.spy.called().must.be.eq(2);
        fef2.spy.called().must.be.eq(2);

        //test1
        t1i1.spy.called().must.be.eq(1);
        t1i2.spy.called().must.be.eq(1);
        fn1.spy.called().must.be.eq(1);
        t1f1.spy.called().must.be.eq(1);
        t1f2.spy.called().must.be.eq(1);

        //test2
        t2i1.spy.called().must.be.eq(1);
        t2i2.spy.called().must.be.eq(1);
        fn2.spy.called().must.be.eq(1);
        t2f1.spy.called().must.be.eq(1);
        t2f2.spy.called().must.be.eq(1);
      });
    });

    describe("only", function() {
      beforeEach(function() {
        loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
        reporters = dummy({}, ["start()", "end()", "ignore()"]);
        runner = spy(new Tester({loggers, reporters, console, only: true}));
        suite = runner.suite;
        init = runner.init;
        fin = runner.fin;
        test = runner.test;
      });

      it("suite without onlys", function() {
        var fw, fn1, fn2, fn3;

        fw = suite("parent", function() {
          test("mytest", fn1 = spy(function() {}));

          suite("child", function() {
            test("mytest", fn2 = spy(function() {}));

            suite("grandchild", function() {
              test("mytest", fn3 = spy(function() {}));
            });
          });
        });

        fw();

        fn1.spy.called().must.be.eq(0);
        fn2.spy.called().must.be.eq(0);
        fn3.spy.called().must.be.eq(0);
      });

      it("parent.only", function() {
        var fw, fn1, fn2, fn3, fn4, fn5, fn6;

        fw = suite.only("parent suite", function() {
          test("mytest1", fn1 = spy(function() {}));
          test.only("mytest2", fn2 = spy(function() {}));

          suite("child suite #1", function() {
            test("mytest3", fn3 = spy(function() {}));
          });

          suite("child suite #2", function() {
            test("mytest4", fn4 = spy(function() {}));

            suite("grandchild suite", function() {
              test("mytest5", fn5 = spy(function() {}));

              suite("great grandchild suite", function() {
                test("mytest6", fn6 = spy(function() {}));
              });
            });
          });
        });

        fw();

        fn1.spy.called().must.be.eq(1);
        fn2.spy.called().must.be.eq(1);
        fn3.spy.called().must.be.eq(1);
        fn4.spy.called().must.be.eq(1);
        fn5.spy.called().must.be.eq(1);
        fn6.spy.called().must.be.eq(1);
      });

      it("child.only", function() {
        var fw, fn1, fn2, fn3, fn4, fn5;

        fw = suite("parent", function() {
          test("mytest", fn1 = spy(function() {}));

          suite.only("child", function() {
            test("mytest", fn2 = spy(function() {}));
            test.only("mytest", fn3 = spy(function() {}));

            suite("grandchild", function() {
              test("mytest", fn4 = spy(function() {}));

              suite("great grandchild", function() {
                test("mytest", fn5 = spy(function() {}));
              });
            });
          });
        });

        fw();

        fn1.spy.called().must.be.eq(0);
        fn2.spy.called().must.be.eq(1);
        fn3.spy.called().must.be.eq(1);
        fn4.spy.called().must.be.eq(1);
        fn5.spy.called().must.be.eq(1);
      });

      it("test.only", function() {
        var fw, fn1, fn2, fn3, fn4;

        fw = suite("parent", function() {
          test("mytest", fn1 = spy(function() {}));
          test.only("mytest", fn2 = spy(function() {}));
          suite("child", function() {
            test.only("mytest", fn3 = spy(function() {}));
          });
          test.only("mytest", fn4 = spy(function() {}));
        });

        fw();

        fn1.spy.called().must.be.eq(0);
        fn2.spy.called().must.be.eq(1);
        fn3.spy.called().must.be.eq(1);
        fn4.spy.called().must.be.eq(1);
      });
    });
  });

  describe("#wrapper.XXX()", function() {
    var fw;

    beforeEach(function() {
      fw = suite(fn);
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

  it("suite.only()", function() {
    suite.only(function() {}).__task__.must.have({only: true, ignore: false});
  });
});
