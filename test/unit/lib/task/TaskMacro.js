//imports
const TaskMacro = require("../../../../dist/es5/nodejs/justo-runner").TaskMacro;

//suite
describe.skip("TaskMacro (task)", function() {
  describe("#constructor()", function() {

  });

  describe("Members", function() {
    describe("#add()", function() {
      var macro;

      beforeEach(function() {
        macro = new TaskMacro("multi", []);
      });

      it("add(task)", function() {
        task.add.must.raise("No task of macro indicated.", [{title: "test", task}]);
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
});
