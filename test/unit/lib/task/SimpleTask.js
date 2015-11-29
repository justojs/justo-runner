//imports
const SimpleTask = require("../../../../dist/es5/nodejs/justo-runner").SimpleTask;

//suite
describe("SimpleTask (task)", function() {
  function sync() {}
  function async(params, done) {}

  describe("#constructor()", function() {
    it("constructor(name, fn)", function() {
      var task = new SimpleTask("task", sync);

      task.must.have({
        namespace: undefined,
        ns: undefined,
        name: "task",
        title: "task",
        fqn: "task",
        description: undefined,
        fn: sync,
        synchronous: true,
        sync: true,
        asynchronous: false,
        async: false,
        parameterized: false,
        ignore: false,
        mute: false
      });
      task.isSimple().must.be.eq(true);
      task.isComposite().must.be.eq(false);
    });

    it("constructor(opts, fn) - sync task", function() {
      var task = new SimpleTask({
        ns: "org.justojs",
        name: "task",
        desc: "Task.",
        title: "The task",
        ignore: true,
        mute: true
      }, sync);

      task.must.have({
        namespace: "org.justojs",
        ns: "org.justojs",
        name: "task",
        title: "The task",
        fqn: "org.justojs.task",
        description: "Task.",
        fn: sync,
        synchronous: true,
        sync: true,
        asynchronous: false,
        async: false,
        parameterized: false,
        ignore: true,
        mute: true
      });
      task.isSimple().must.be.eq(true);
      task.isComposite().must.be.eq(false);
    });

    it("constructor(opts, fn) - async task and parameterized", function() {
      var task = new SimpleTask({
        ns: "org.justojs",
        name: "task",
        title: "Task",
        desc: "Task.",
        ignore: true,
        mute: true
      }, async);

      task.must.have({
        namespace: "org.justojs",
        ns: "org.justojs",
        name: "task",
        title: "Task",
        fqn: "org.justojs.task",
        description: "Task.",
        fn: async,
        synchronous: false,
        sync: false,
        asynchronous: true,
        async: true,
        parameterized: true,
        ignore: true,
        mute: true
      });
      task.isSimple().must.be.eq(true);
      task.isComposite().must.be.eq(false);
    });
  });
});
