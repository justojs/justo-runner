//imports
const FileMacro = require("../../../../dist/es5/nodejs/justo-runner").FileMacro;

//suite
describe("FileMacro (task)", function() {
  describe("#constructor()", function() {
    it("constructor(opts : string, config) - !src and !require", function() {
      var macro = new FileMacro("test", {});

      macro.must.have({
        ns: undefined,
        name: "test",
        title: "test",
        fqn: "test",
        desc: undefined,
        ignore: false,
        onlyIf: true,
        require: [],
        src: []
      });
    });

    it("constructor(opts : string, config) - src : string and require : string", function() {
      var macro = new FileMacro("test", {src: "test/unit/data/one.js", require: "justo-assert"});

      macro.must.have({
        ns: undefined,
        name: "test",
        title: "test",
        fqn: "test",
        desc: undefined,
        ignore: false,
        onlyIf: true,
        require: ["justo-assert"],
        src: ["test/unit/data/one.js"]
      });
    });

    it("constructor(opts : string, config) - src : string[] and require : string[]", function() {
      var macro = new FileMacro("test", {src: ["test/unit/data/one.js"], require: ["justo-assert"]});

      macro.must.have({
        ns: undefined,
        name: "test",
        title: "test",
        fqn: "test",
        desc: undefined,
        ignore: false,
        onlyIf: true,
        require: ["justo-assert"],
        src: ["test/unit/data/one.js"]
      });
    });
  });
});
