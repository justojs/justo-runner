//imports
const Workflow = require("../../../../dist/es5/nodejs/justo-runner").Workflow;

//suite
describe("Workflow (task)", function() {
  function sync() {}
  function async(params, done) {}

  describe("#constructor()", function() {
    it("constructor(name, fn)", function() {
      var task = new Workflow("task", sync);

      task.must.have({
        namespace: undefined,
        ns: undefined,
        name: "task",
        fqn: "task",
        description: undefined,
        fn: sync,
        synchronous: true,
        sync: true,
        asynchronous: false,
        async: false,
        parameterized: false
      });
      task.isSimple().must.be.eq(false);
      task.isComposite().must.be.eq(true);
    });

    it("constructor(opts, fn) - sync workflow", function() {
      var task = new Workflow({ns: "org.justojs", name: "task", desc: "Task."}, sync);

      task.must.have({
        namespace: "org.justojs",
        ns: "org.justojs",
        name: "task",
        fqn: "org.justojs.task",
        description: "Task.",
        fn: sync,
        synchronous: true,
        sync: true,
        asynchronous: false,
        async: false,
        parameterized: false
      });
      task.isSimple().must.be.eq(false);
      task.isComposite().must.be.eq(true);
    });

    it("constructor(opts, fn) - async workflow", function() {
      var task = new Workflow({ns: "org.justojs", name: "task", desc: "Task."}, async);

      task.must.have({
        namespace: "org.justojs",
        ns: "org.justojs",
        name: "task",
        fqn: "org.justojs.task",
        description: "Task.",
        fn: async,
        synchronous: false,
        sync: false,
        asynchronous: true,
        async: true,
        parameterized: true
      });
      task.isSimple().must.be.eq(false);
      task.isComposite().must.be.eq(true);
    });
  });
});
