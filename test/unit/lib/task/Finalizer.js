//imports
const Finalizer = require("../../../../dist/es5/nodejs/justo-runner").Finalizer;

//suite
describe("Finalizer (task)", function() {
  describe("#constructor", function() {
    function fn() {}

    it("suite", function() {
      var fin = new Finalizer("__suite__", fn);

      fin.must.have({
        ns: undefined,
        name: "__suite__",
        title: "fin()",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(true);
      fin.isOfForEach().must.be.eq(false);
      fin.isOfSpecificTest().must.be.eq(false);
    });

    it("foreach", function() {
      var fin = new Finalizer("*", fn);

      fin.must.have({
        ns: undefined,
        name: "*",
        title: "fin(*)",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(false);
      fin.isOfForEach().must.be.eq(true);
      fin.isOfSpecificTest().must.be.eq(false);
    });

    it("test", function() {
      var fin = new Finalizer("test", fn);

      fin.must.have({
        ns: undefined,
        name: "test",
        title: "fin(test)",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(false);
      fin.isOfForEach().must.be.eq(false);
      fin.isOfSpecificTest().must.be.eq(true);
    });
  });
});
