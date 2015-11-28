//imports
const dummy = require("justo-dummy");
const spy = require("justo-spy");
const Runner = require("../../../../dist/es5/nodejs/justo-runner").Runner;

//suite
describe("Runner", function() {
  var loggers, reporters;

  beforeEach(function() {
    loggers = dummy({}, ["debug()", "info()", "warn()", "error()", "fatal()"]);
    reporters = dummy({}, ["start()", "end()", "ignore()"]);
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
});
