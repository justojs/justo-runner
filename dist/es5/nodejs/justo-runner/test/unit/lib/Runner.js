//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Runner = require("../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Runner", function() {
  var loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()"]);
  });

  describe("#constructor()", function() {
    it("constructor()", function() {
      (function() {
        var runner = new Runner();
      }).must.raise("Expected runner configuration.");
    });

    it("constructor(config) - without reporters", function() {
      (function() {
        var runner = new Runner({loggers: {}});
      }).must.raise("Expected reporters.");
    });

    it("constructor(config) - without loggers", function() {
      (function() {
        var runner = new Runner({reporters: {}});
      }).must.raise("Expected loggers.");
    });

    it("constructor(config)", function() {
      var runner = new Runner({loggers: {}, reporters: {}});
      runner.loggers.must.not.be.eq(undefined);
      runner.reporters.must.not.be.eq(undefined);
    });
  });

  describe("Report", function() {
    var runner;

    beforeEach(function() {
      runner = new Runner({
        reporters: spy({}, ["start() {}", "end() {}"]),
        loggers: spy({}, ["debug() {}"])
      });

      runner = spy(runner, ["start()", "end()"]);
    });

    it("#start(title)", function() {
      runner.start("Test report");

      runner.spy.called("start()").must.be.eq(1);
      runner.spy.called("end()").must.be.eq(0);
      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.calledWith("start()", ["Test report"]).must.be.eq(1);
      runner.reporters.spy.called("end()").must.be.eq(0);
      runner.loggers.spy.called("debug()").must.be.eq(1);
      runner.loggers.spy.calledWith("debug()", ["Starting report 'Test report'."]).must.be.eq(1);
    });

    it("#end()", function() {
      runner.start("Test report");
      runner.end();

      runner.spy.called("start()").must.be.eq(1);
      runner.spy.called("end()").must.be.eq(1);
      runner.reporters.spy.called("start()").must.be.eq(1);
      runner.reporters.spy.called("end()").must.be.eq(1);
      runner.loggers.spy.called("debug()").must.be.eq(2);
      runner.loggers.spy.getArguments("debug()", 0).must.be.eq(["Starting report 'Test report'."]);
      runner.loggers.spy.getArguments("debug()", 1).must.be.eq(["Ending report."]);
    });
  });
});
