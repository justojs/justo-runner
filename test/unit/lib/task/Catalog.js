//imports
const Runner = require("../../../../dist/es5/nodejs/justo-runner").Runner;
const Catalog = require("../../../../dist/es5/nodejs/justo-runner/lib/Catalog");

//suite
describe("Catalog", function() {
  var runner;

  beforeEach(function() {
    runner = new Runner({
      loggers: {},
      reporters: {}
    });
  });

  describe("#constructor()", function() {
    it("constructor(runner)", function() {
      var catalog = new Catalog(runner);
      catalog.must.be.instanceOf(Catalog);
      catalog.catalog.must.be.instanceOf(Function);
      catalog.catalog.workflow.must.be.instanceOf(Function);
      catalog.catalog.macro.must.be.instanceOf(Function);
      catalog.catalog.simple.must.be.instanceOf(Function);
    });
  });

  describe("Members", function() {
    var catalog;

    beforeEach(function() {
      catalog = new Catalog(runner);
    });

    describe("#add()", function() {
      it("add(simple)", function() {
        var wrapper = runner.simple("test", function() {});

        catalog.add(wrapper);
        catalog.get("test").must.be.same(wrapper);
      });

      it("add(macro)", function() {
        var wrapper = runner.macro("test", []);

        catalog.add(wrapper);
        catalog.get("test").must.be.same(wrapper);
      });

      it("add(workflow)", function() {
        var wrapper = runner.workflow("test", function() {});

        catalog.add(wrapper);
        catalog.get("test").must.be.same(wrapper);
      });
    });

    describe("#exists()", function() {
      it("exists(fqn) - existing", function() {
        catalog.add(runner.workflow("test", function() {}));
        catalog.exists("test").must.be.eq(true);
      });

      it("exists(fqn) - not existing", function() {
        catalog.exists("test").must.be.eq(false);
      });
    });

    describe("#catalog()", function() {
      it("catalog.workflow()", function() {
        catalog.catalog.workflow("test", function() {});
        catalog.exists("test");
        catalog.get("test").must.be.instanceOf(Function);
        catalog.get("test").__task__.must.be.instanceOf("Workflow");
      });

      it("catalog.macro() - task macro", function() {
        catalog.catalog.macro("test", []);
        catalog.exists("test");
        catalog.get("test").must.be.instanceOf(Function);
        catalog.get("test").__task__.must.be.instanceOf("TaskMacro");
      });

      it("catalog.macro() - file macro", function() {
        catalog.catalog.macro("test", {});
        catalog.exists("test");
        catalog.get("test").must.be.instanceOf(Function);
        catalog.get("test").__task__.must.be.instanceOf("FileMacro");
      });

      it("catalog.simple()", function() {
        catalog.catalog.simple("test", function() {});
        catalog.exists("test");
        catalog.get("test").must.be.instanceOf(Function);
        catalog.get("test").__task__.must.be.instanceOf("SimpleTask");
      });
    });
  });
});
