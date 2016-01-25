//imports
const Initializer = require("../../../../dist/es5/nodejs/justo-runner").Initializer;

//suite
describe("Initializer (task)", function() {
  describe("#constructor", function() {
    function fn() {}

    it("suite", function() {
      var fin = new Initializer("__suite__", fn);

      fin.must.have({
        ns: undefined,
        name: "__suite__",
        title: "init()",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(true);
      fin.isOfForEach().must.be.eq(false);
      fin.isOfSpecificTest().must.be.eq(false);
    });

    it("foreach", function() {
      var fin = new Initializer("*", fn);

      fin.must.have({
        ns: undefined,
        name: "*",
        title: "init(*)",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(false);
      fin.isOfForEach().must.be.eq(true);
      fin.isOfSpecificTest().must.be.eq(false);
    });

    it("test", function() {
      var fin = new Initializer("test", fn);

      fin.must.have({
        ns: undefined,
        name: "test",
        title: "init(test)",
        fn: fn
      });

      fin.isOfSuite().must.be.eq(false);
      fin.isOfForEach().must.be.eq(false);
      fin.isOfSpecificTest().must.be.eq(true);
    });
  });
});
