//imports
const Macro = require("../../../../dist/es5/nodejs/justo-runner").Macro;

//suite
describe("Macro (task)", function() {
  var task1 = function task1() {};
  var task2 = function task2() {};

  describe("#constructor()", function() {
    it("constructor(name, tasks)", function() {
      var task = new Macro("macro", [task1, task2]);
      task.must.have({
        namespace: undefined,
        ns: undefined,
        name: "macro",
        fqn: "macro",
        description: undefined,
        length: 2
      });
      task.tasks[0].must.have({
        title: "task1",
        task: task1,
        params: undefined
      });
      task.tasks[1].must.have({
        title: "task2",
        task: task2,
        params: undefined
      });
      task.isSimple().must.be.eq(false);
      task.isComposite().must.be.eq(true);
    });

    it("constructor(opts, tasks)", function() {
      var task = new Macro({ns: "org.justojs", name: "macro", desc: "Macro."}, [task1]);

      task.must.have({
        namespace: "org.justojs",
        ns: "org.justojs",
        name: "macro",
        fqn: "org.justojs.macro",
        description: "Macro.",
        length: 1
      });
      task.tasks[0].must.have({
        title: "task1",
        task: task1,
        params: undefined
      });
      task.isSimple().must.be.eq(false);
      task.isComposite().must.be.eq(true);
    });
  });

  describe("#add()", function() {
    var task;

    beforeEach(function() {
      task = new Macro("multi", []);
    });

    it("add(task)", function() {
      task.add.must.raise("No task of macro indicated.", [{}]);
    });

    it("add(task : function)", function() {
      task.add(task1);
      task.length.must.be.eq(1);
      task.tasks[0].must.have({
        title: "task1",
        task: task1,
        params: undefined
      });
    });

    it("add(task : object)", function() {
      task.add({title: "first", task: task1, params: {src: "src.js", dst: "dst.js"}});
      task.length.must.be.eq(1);
      task.tasks[0].must.have({
        title: "first",
        task: task1,
        params: {src: "src.js", dst: "dst.js"}
      });
    });
  });
});
