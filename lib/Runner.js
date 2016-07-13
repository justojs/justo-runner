//imports
import {inject} from "justo-injector";
import {ResultState} from "justo-result";
import {Loader} from "justo-loader";
import * as fs from "justo-fs";
import SimpleTask from "./SimpleTask";
import FileMacro from "./FileMacro";
import TaskMacro from "./TaskMacro";
import Workflow from "./Workflow";
import RunError from "./RunError";
import Catalog from "./Catalog";
import Stack from "./Stack";
import Initializer from "./Initializer";
import Finalizer from "./Finalizer";
import Suite from "./Suite";
import Test from "./Test";

//private member symbols
const simple = Symbol();
const macro = Symbol();
const taskMacro = Symbol();
const fileMacro = Symbol();
const workflow = Symbol();
const suite = Symbol();
const test = Symbol();
const init = Symbol();
const fin = Symbol();
const runSyncSimpleTask = Symbol();
const runAsyncSimpleTask = Symbol();

/**
 * A runner.
 *
 * @readonly loggers:loggers      The logger to use.
 * @readonly reporters:Reporters  The reporters to notify.
 * @readonly breakOnError:boolean Break on error? yep, true; nope, false.
 */
export default class Runner {
  /**
   * Constructor.
   *
   * @params config:object  The run configuration.
   */
  constructor(config) {
    //(1) arguments
    if (!config) throw new Error("Expected runner configuration.");
    if (!config.reporters) throw new Error("Expected reporters.");
    if (!config.loggers) throw new Error("Expected loggers.");
    if (!config.console) throw new Error("Expected console.");

    //(2) init
    Object.defineProperty(this, "breakOnError", {value: config.onError == "break", enumerable: true});
    Object.defineProperty(this, "only", {value: !!config.only, enumerable: true});
    Object.defineProperty(this, "catalog", {value: new Catalog(this), enumerable: true});
    Object.defineProperty(this, "stack", {value: new Stack()});
    Object.defineProperty(this, "tasks", {value: []});
    Object.defineProperty(this, "loggers", {value: config.loggers, enumerable: true});
    Object.defineProperty(this, "console", {value: config.console});
    Object.defineProperty(this, "reporters", {value: config.reporters, enumerable: true});
    Object.defineProperty(this, "simple", {value: this[simple].bind(this), enumerable: true});
    Object.defineProperty(this, "macro", {value: this[macro].bind(this), enumerable: true});
    Object.defineProperty(this, "workflow", {value: this[workflow].bind(this), enumerable: true});
    Object.defineProperty(this, "suite", {value: this[suite].bind(this), enumerable: true});
    Object.defineProperty(this, "test", {value: this[test].bind(this), enumerable: true});
    Object.defineProperty(this, "init", {value: this[init].bind(this), enumerable: true});
    Object.defineProperty(this, "fin", {value: this[fin].bind(this), enumerable: true});

    Object.defineProperty(this.suite, "only", {enumerable: true, value: (...args) => {
      var opts, def;

      if (args.length === 0) {
        throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
      } else if (args.length == 1) {
        opts = {only: true};
        def = args[0];
      } else if (args.length >= 2) {
        if (typeof(args[0]) == "string") opts = {name: args[0], only: true};
        else opts = args[0];

        def = args[1];
      }

      return this.suite(opts, def);
    }});

    Object.defineProperty(this.test, "only", {enumerable: true, value: (...args) => {
      var opts, fn;

      if (args.length === 0) {
        throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
      } else if (args.length == 1) {
        opts = {only: true};
        fn = args[0];
      } else if (args.length >= 2) {
        if (typeof(args[0]) == "string") opts = {name: args[0], only: true};
        else opts = args[0];

        fn = args[1];
      }

      return this.test(opts, fn);
    }});
  }

  /**
   * Continue on error? yep, true; nope, false.
   *
   * @type boolean
   */
  get continueOnError() {
    return !this.breakOnError;
  }

  /**
   * Publish the members into the specified object.
   *
   * @param obj:object  Object where to publish.
   */
  publishInto(obj) {
    Object.defineProperty(obj, "catalog", {value: this.catalog.catalog, enumerable: true, configurable: true});
    Object.defineProperty(obj, "register", {value: this.catalog.catalog, enumerable: true, configurable: true});
    Object.defineProperty(obj, "simple", {value: this.simple, enumerable: true, configurable: true});
    Object.defineProperty(obj, "macro", {value: this.macro, enumerable: true, configurable: true});
    Object.defineProperty(obj, "workflow", {value: this.workflow, enumerable: true, configurable: true});
    Object.defineProperty(obj, "suite", {value: this.suite, enumerable: true, configurable: true});
    Object.defineProperty(obj, "test", {value: this.test, enumerable: true, configurable: true});
    Object.defineProperty(obj, "init", {value: this.init, enumerable: true, configurable: true});
    Object.defineProperty(obj, "fin", {value: this.fin, enumerable: true, configurable: true});
  }

  /**
   * Unpublish the members from the specified object.
   *
   * @param obj:object  Object where to unpublish from.
   */
  unpublishFrom(obj) {
    delete obj.catalog;
    delete obj.register;
    delete obj.simple;
    delete obj.macro;
    delete obj.workflow;
    delete obj.suite;
    delete obj.test;
    delete obj.init;
    delete obj.fin;
  }

  /**
   * Check the run state.
   *
   * @type ResultState
   */
  get state() {
    var res;

    //(1) check
    for (let rep of this.reporters.items) {
      if (rep.name == "state") res = rep.state;
    }

    //(2) return
    return res;
  }

  /**
   * Runs a cataloged task.
   *
   * @param calls:object[]  The calls. Every call is: name (string) and params (Object[]).
   * @throws Error if some task is not cataloged.
   * @return object
   */
  runCatalogedTasks(calls) {
    var wrapper;

    //(1) check the tasks
    for (let call of calls) {
      if (!this.catalog.exists(call.name)) throw new Error(`The '${call.name}' task is not cataloged.`);
    }

    //(2) run
    for (let call of calls) {
      this.reporters.start(call.name);
      this.catalog.get(call.name)(call.name, ...call.params);
      this.reporters.end();
    }
  }

  /**
   * Wraps a simple task.
   *
   * @overload
   * @param fn:function
   * @return function
   *
   * @overload
   * @param name:string
   * @param fn:function
   * @return function
   *
   * @overload
   * @param opts:object
   * @param fn:function
   * @return function
   *
   */
  [simple](...args) {
    var opts, fn, task, wrapper;

    //(1) argumentsx
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, the task function must be passed.");
    } else if (args.length == 1) {
      fn = args[0];
      opts = {};
    } else if (args.length >= 2) {
      [opts, fn] = args;
    }

    if (typeof(opts) == "object" && !opts.name) opts.name = fn.name || "simple anonymous task";

    //(2) create task
    task = new SimpleTask(opts, fn);

    //(3) create function
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runSimpleTask(task, opts, params);
    };

    this.initWrapper(wrapper, task);

    //(4) return wrapper function
    return wrapper;
  }

  /**
   * Runs a simple task.
   *
   * @protected
   * @param task:SimpleTask The task.
   * @param opts:object     The run options.
   * @param params:object[] The arguments.
   */
  runSimpleTask(task, opts, params) {
    var res;

    //(1) check options
    opts = Object.assign({title: task.title, ignore: task.ignore, mute: task.mute}, opts);
    if (opts.hasOwnProperty("onlyIf")) opts.ignore = !opts.onlyIf;
    if (opts.hasOwnProperty("onlyif")) opts.ignore = !opts.onlyif;

    //(2) run
    if (opts.ignore) {
      this.loggers.debug(`Ignoring simple task '${opts.title}'.`);
      if (!opts.mute) this.reporters.ignore(opts.title, task);
    } else {
      if (task.sync) res = this[runSyncSimpleTask](task, opts, params);
      else this[runAsyncSimpleTask](task, opts, params);
    }

    //(3) return
    return res;
  }

  [runSyncSimpleTask](task, opts, params) {
    let res, state, err, start, end;

    //(1) run
    try {
      let fn = task.fn;

      params = inject({params, logger: this.loggers, log: this.loggers, console: this.console}, fn);

      this.loggers.debug(`Starting sync run of simple task '${opts.title}'.`);
      if (!opts.mute) this.reporters.start(opts.title, task);

      start = Date.now();
      res = fn(...params);
      state = ResultState.OK;
    } catch (e) {
      err = e;
      state = ResultState.FAILED;
    } finally {
      end = Date.now();
    }

    this.loggers.debug(`Ended sync run of simple task '${opts.title}' in '${state}' state.`);
    if (!opts.mute) this.reporters.end(task, state, err, start, end);
    if (err && this.breakOnError) throw new RunError(task, err);

    //(3) return value returned by the task function
    return res;
  }

  [runAsyncSimpleTask](task, opts, params) {
    var state, err, start, end;

    try {
      let fn = task.fn;

      this.loggers.debug(`Starting async run of simple task '${opts.title}'.`);
      if (!opts.mute) this.reporters.start(opts.title, task);

      start = Date.now();
      err = this.runAsyncFunction(fn, params);
      state = (err ? ResultState.FAILED : ResultState.OK);
    } catch (e) {
      err = e;
      state = ResultState.FAILED;
    } finally {
      end = Date.now();
    }

    this.loggers.debug(`Ended async run of simple task '${opts.title}' in '${state}' state.`);
    if (!opts.mute) this.reporters.end(task, state, err, start, end);
    if (err && this.breakOnError) throw new RunError(task, err);
  }

  /**
   * Runs a function asynchronously.
   * Returns undefined if ok; otherwise, the error.
   *
   * @param fn:function     The function.
   * @param params:object[] The parameters.
   * @return object
   * @protected
   */
  runAsyncFunction(fn, params) {
    const sync = require("justo-sync");
    var err;

    try {
      sync((done) => {
        function jdone(err, res) {
          if (err) {
            if (err instanceof Error) done(err);
            else done(new Error(err));
          } else {
            done(undefined, res);
          }
        }

        params = inject({done: jdone, params, logger: this.loggers, log: this.loggers, console: this.console}, fn);
        fn(...params);
      });
    } catch (e) {
      err = e;
    }

    return err;
  }

  /**
   * Wraps a macro.
   *
   * @overload Task macro.
   * @param opts:object
   * @param tasks:object[]
   * @return function
   *
   * @overload Task macro.
   * @param name:string
   * @param tasks:object[]
   * @return function
   *
   * @overload File macro.
   * @param name:string
   * @param config:object
   * @return function
   *
   * @overload File macro.
   * @param opts:object
   * @param config:object
   * @return function
   */
  [macro](...args) {
    var opts, tasks;

    //(1) arguments
    if (args.length < 2) {
      throw new Error("Invalid number of arguments. At least, two: name and array or object.");
    } else if (args.length >= 2) {
      [opts, tasks] = args;
    }

    //(2) return
    if (tasks instanceof Array) return this[taskMacro](opts, tasks);
    else return this[fileMacro](opts, tasks);
  }

  /**
   * Create a task macro.
   */
  [taskMacro](opts, tasks) {
    var macro, wrapper;

    //(1) create macro
    macro = new TaskMacro(opts, []);

    for (let task of tasks) {
      if (typeof(task) == "string") task = {title: task, task};
      if (typeof(task.task) == "string") {
        if (!this.catalog.exists(task.task)) throw new Error(`The '${task.task}' task is not cataloged.`);
        if (!task.title) task.title = task.task;
        task.task = this.catalog.get(task.task);
      }

      if (!task.hasOwnProperty("title")) throw new Error("Title must be specified.");
      if (!task.hasOwnProperty("task")) throw new Error("Task must be specified.");

      macro.add(task);
    }

    //(2) create wrapper
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runTaskMacro(macro, opts, params);
    };

    this.initWrapper(wrapper, macro);

    //(3) return wrapper
    return wrapper;
  }

  /**
   * Runs a macro.
   *
   * @protected
   * @param macro:Macro     The macro.
   * @param opts:object     The run options.
   * @param params:object[] The arguments.
   */
  runTaskMacro(macro, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || macro.title;
    if (!opts.hasOwnProperty("ignore")) opts.ignore = macro.ignore;
    if (!opts.hasOwnProperty("mute")) opts.mute = macro.mute;
    params = (params.length === 0 ? undefined : params);

    //(2) run
    if (opts.ignore) {
      this.loggers.debug(`Ignoring macro '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, macro);
    } else {
      let err;

      this.loggers.debug(`Starting run of macro '${title}'.`);
      if (!opts.mute) this.reporters.start(title, macro);

      try {
        for (let task of macro.tasks) {
          try {
            let oo = {title: task.title, mute: opts.mute};
            let pp = params || task.params || [];

            task.task(oo, ...pp);
          } catch (e) {
            err = e;
            if (this.breakOnError) break;
          }
        }
      } finally {
        if (err) this.loggers.debug(`Ended run of macro '${title}' on error.`);
        else this.loggers.debug(`Ended run of macro '${title}'.`);

        if (!opts.mute) this.reporters.end(macro);
      }
    }
  }

  /**
   * Create a file macro.
   */
  [fileMacro](opts, config) {
    var macro, wrapper;

    //(1) create macro
    macro = new FileMacro(opts, config);

    //(2) create wrapper
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runFileMacro(macro, opts, params);
    };

    this.initWrapper(wrapper, macro);

    //(4) return wrapper function
    return wrapper;
  }

  runFileMacro(macro, opts, params) {
    var title, res;
    const loadFile = (file) => {
      this.workflow(file, () => { Loader.load(file); })({title: file, mute: opts.mute});
    };
    const loadDir = (dir) => {
      for (let entry of new fs.Dir(dir).entries) {
        if (entry instanceof fs.File) loadFile(entry.path);
        else if (entry instanceof fs.Dir) loadDir(entry.path);
        else loadFile(entry.path);
      }
    };

    //(1) init
    title = opts.title || macro.title;
    if (!opts.hasOwnProperty("ignore")) opts.ignore = macro.ignore;
    if (!opts.hasOwnProperty("mute")) opts.mute = macro.mute;
    params = (params.length === 0 ? undefined : params);

    //(2) run
    if (opts.ignore) {
      this.loggers.debug(`Ignoring macro '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, macro);
    } else {
      let err;

      this.loggers.debug(`Starting run of macro '${title}'.`);
      if (!opts.mute) this.reporters.start(title, macro);

      if (macro.require) {
        for (let pkg of macro.require) require(pkg);
      }

      try {
        for (let src of macro.src) {
          let entry;

          try {
            try {
              entry = fs.entry(src);
            } catch (e) {
              entry = undefined;
            }

            if (entry instanceof fs.File) loadFile(src);
            else if (entry instanceof fs.Dir) loadDir(src);
            else loadFile(src);
          } catch (e) {
            err = e;
            if (this.breakOnError) break;
          }
        }
      } finally {
        if (err) this.loggers.debug(`Ended run of macro '${title}' on error.`);
        else this.loggers.debug(`Ended run of macro '${title}'.`);

        if (!opts.mute) this.reporters.end(macro);
      }
    }
  }

  /**
   * Wraps a workflow.
   *
   * @overload
   * @param fn:function
   * @return function
   *
   * @overload
   * @param opts:object
   * @param fn:function
   * @return function
   *
   * @overload
   * @param name:string
   * @param fn:function
   * @return function
   */
  [workflow](...args) {
    var opts, fn, task, wrapper;

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, the workflow function must be passed.");
    } else if (args.length == 1) {
      fn = args[0];
      opts = {};
    } else if (args.length >= 2) {
      [opts, fn] = args;
    }

    if (typeof(opts) == "object" && !opts.name) opts.name = fn.name || "anonymous workflow";

    //(2) create task
    task = new Workflow(opts, fn);

    //(3) create function
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runWorkflow(task, opts, params);
    };

    this.initWrapper(wrapper, task);

    //(4) return wrapper function
    return wrapper;
  }

  /**
   * Run a workflow.
   *
   * @protected
   * @param workflow:Workflow The workflow to run.
   * @param opts:object       The run options.
   * @param params:object[]   The run arguments.
   */
  runWorkflow(workflow, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || workflow.title;
    if (!opts.hasOwnProperty("ignore")) opts.ignore = workflow.ignore;
    if (!opts.hasOwnProperty("mute")) opts.mute = workflow.mute;

    //(2) run
    if (opts.ignore) {
      this.loggers.debug(`Ignoring workflow '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, workflow);
    } else {
      let state, err, start, end;

      try {
        let fn = workflow.fn;
        params = inject({params: params, logger: this.loggers, log: this.loggers, console: this.console}, fn);

        this.loggers.debug(`Starting run of workflow '${title}'.`);
        if (!opts.mute) this.reporters.start(title, workflow);

        start = Date.now();
        res = fn(...params);
        state = ResultState.OK;
      } catch (e) {
        err = e;
        state = ResultState.FAILED;
      } finally {
        end = Date.now();
      }

      this.loggers.debug(`Ended run of workflow '${title}' in '${state}' state.`);
      if (!opts.mute) this.reporters.end(workflow, state, err, start, end);
      if (err && this.breakOnError) throw new RunError(workflow, err);
    }

    //(3) return value returned by the task function
    return res;
  }

  /**
   * Create and register a suite.
   *
   * @overload
   * @param def:function  The definition function.
   * @return function
   *
   * @overload
   * @param opts:Object   The suite options.
   * @param def:function  The definition function.
   * @return function
   *
   * @overload
   * @param name:object   The suite name.
   * @param def:function  The definition function.
   * @return function
   */
  [suite](...args) {
    var opts, def, task, wrapper;

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
    } else if (args.length == 1) {
      opts = {};
      def = args[0];
    } else if (args.length >= 2) {
      [opts, def] = args;
    }

    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) opts.name = "anonymous suite";

    //(2) create suite object
    task = new Suite(opts);

    //(3) execute definition function
    this.stack.push(task);
    def();
    this.stack.pop();

    //(4) create wrapper
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      if (!this.only || (this.only && (task.only || task.superonly || task.subonly))) {
        return this.runSuite(task, opts, params);
      }
    };

    this.initTestWrapper(wrapper, task);

    //(5) add suite wrapper to parent suite
    if (this.stack.length > 0) this.stack.top.add(wrapper);

    //(6) return wrapper function
    return wrapper;
  }

  /**
   * Run a suite.
   *
   * @private
   * @param suite:Suite     The suite to run.
   * @param opts:object     The run options.
   * @param params:object[] The run parameters.
   */
  runSuite(suite, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || suite.title;
    if (!opts.hasOwnProperty("mute")) opts.mute = suite.mute;

    //(2) run
    if (opts.ignore || suite.ignore) {
      this.loggers.debug(`Ignoring suite '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, suite);
    } else {
      let oo = {};
      if (opts.mute) oo.mute = true;

      //run inits, tasks, fins; these are task wrappers
      this.loggers.debug(`Starting run of suite '${title}'.`);
      if (!opts.mute) this.reporters.start(title, suite);

      for (let init of suite.initializers) init(oo, ...params);

      if (!this.only) { //-o option not set: run all
        for (let task of suite.tasks) task(oo, ...params);
      } else {          //-o option set
        if (suite.only || suite.superonly) {
          for (let task of suite.tasks) task(oo, ...params);
        } else if (suite.subonly) {
          for (let task of suite.tasks) {
            if (task.__task__.only || task.__task__.superonly || task.__task__.subonly) task(oo, ...params);
          }
        }
      }

      for (let fin of suite.finalizers) fin(oo, ...params);

      this.loggers.debug(`Ended run of suite '${title}'.`);
      if (!opts.mute) this.reporters.end(suite);
    }
  }

  /**
   * Create and register a test.
   *
   * @overload
   * @param name:string The test name.
   * @param fn:function The test function.
   *
   * @overload
   * @param opts:object The test options.
   * @param fn:function The test function.
   */
  [test](...args) {
    var opts, fn, task, wrapper;

    //(0) pre
    if (this.stack.length === 0) {
      throw new Error("test() must be invoked into a suite.");
    }

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, one expected: the test function.");
    } else if (args.length == 1) {
      fn = args[0];
      opts = {};
    } else if (args.length >= 2) {
      [opts, fn] = args;
    }

    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) opts.name = "anonymous test";

    //(2) create test object
    task = new Test(opts, this.simple({name: "test function", title: "Test function"}, fn));

    //(3) create wrapper
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runTest(task, opts, params);
    };

    this.initTestWrapper(wrapper, task);

    //(4) add init wrapper to suite
    this.stack.top.add(wrapper);

    //(5) return wrapper function
    return wrapper;
  }

  /**
   * Run a test.
   *
   * @protected
   */
  runTest(test, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || test.title;

    if (!opts.hasOwnProperty("mute")) opts.mute = test.mute;

    //(2) run
    if (opts.ignore || test.ignore) {
      this.loggers.debug(`Ignoring test '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, test);
    } else {
      let oo = {};  //options for this run
      if (opts.mute) oo.mute = true;

      if (test.hasParams()) {
        for (let params of test.params) {
          let headline = title + " # " + (typeof(params) == "object" ? JSON.stringify(params) : params);

          //run inits, test function, fins; these are task wrappers
          this.loggers.debug(`Starting run of test '${headline}'.`);
          if (!opts.mute) this.reporters.start(headline, test);

          for (let init of test.initializers) init(oo, ...[params]);
          test.fn(oo, ...[params]);
          for (let fin of test.finalizers) fin(oo, ...[params]);

          this.loggers.debug(`Ended run of test '${headline}'.`);
          if (!opts.mute) this.reporters.end(test);
        }
      } else {
        //run inits, test function, fins; these are task wrappers
        this.loggers.debug(`Starting run of test '${title}'.`);
        if (!opts.mute) this.reporters.start(title, test);

        for (let init of test.initializers) init(oo, ...params);
        test.fn(oo, ...params);
        for (let fin of test.finalizers) fin(oo, ...params);

        this.loggers.debug(`Ended run of test '${title}'.`);
        if (!opts.mute) this.reporters.end(test);
      }
    }
  }

  /**
   * Create and register an initializer.
   *
   * @overload
   * @param fn:function The init function.
   * @return function
   *
   * @overload
   * @param name:string The init name.
   * @param fn:function The init function.
   * @return function
   *
   * @overload
   * @param opts:object The init options.
   * @param fn:function The init function.
   * @return function
   */
  [init](...args) {
    var opts, fn, task, wrapper;

    //(0) pre
    if (this.stack.length === 0) {
      throw new Error("init() must be invoked into a suite.");
    }

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, one expected: the init function.");
    } else if (args.length == 1) {
      fn = args[0];
      opts = {name: "__suite__"};
    } else if (args.length >= 2) {
      [opts, fn] = args;
    }

    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) opts.name = "__suite__";

    //(2) create init object
    task = new Initializer(opts, fn);

    //(3) create function
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runInit(task, opts, params);
    };

    this.initWrapper(wrapper, task);

    //(4) add init wrapper to suite
    this.stack.top.add(wrapper);

    //(5) return wrapper function
    return wrapper;
  }

  /**
   * Run an initializer.
   *
   * @protected
   */
  runInit(task, opts, params) {
    return this.runSimpleTask(task, opts, params);
  }

  /**
   * Create and register an finalizer.
   *
   * @overload
   * @param fn:function The fin function.
   * @return function
   *
   * @overload
   * @param name:string The fin name.
   * @param fn:function The fin function.
   * @return function
   *
   * @overload
   * @param opts:object The fin options.
   * @param fn:function The fin function.
   * @return function
   */
  [fin](...args) {
    var opts, fn, task, wrapper;

    //(0) pre
    if (this.stack.length === 0) {
      throw new Error("fin() must be invoked into a suite.");
    }

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, one expected: the fin function.");
    } else if (args.length == 1) {
      fn = args[0];
      opts = {name: "__suite__"};
    } else if (args.length >= 2) {
      [opts, fn] = args;
    }

    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) opts.name = "__suite__";

    //(2) create init object
    task = new Finalizer(opts, fn);

    //(3) create function
    wrapper = (...args) => {
      var opts, params;

      //(1) arguments
      if (args.length === 0) {
        opts = {};
        params = [];
      } else if (args.length == 1) {
        opts = args[0];
        params = [];
      } else if (args.length >= 2) {
        opts = args[0];
        params = args.slice(1);
      }

      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this.runFin(task, opts, params);
    };

    this.initWrapper(wrapper, task);

    //(4) add wrapper to suite
    this.stack.top.add(wrapper);

    //(5) return wrapper function
    return wrapper;
  }

  /**
   * Run an initializer.
   *
   * @protected
   */
  runFin(task, opts, params) {
    return this.runSimpleTask(task, opts, params);
  }

  /**
   * Initialize the wrapper function.
   *
   * @protected
   * @param wrapper:function  The wrapper function.
   * @param task:Task         The task.
   */
  initWrapper(wrapper, task) {
    Object.defineProperty(wrapper, "__task__", {value: task});

    Object.defineProperty(wrapper, "ignore", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        wrapper(Object.assign({}, opts, {ignore: true}), ...params);
      },
      enumerable: true
    });

    Object.defineProperty(wrapper, "mute", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        return wrapper(Object.assign({}, opts, {mute: true}), ...params);
      },
      enumerable: true
    });

    Object.defineProperty(wrapper, "title", {
      value: (title) => {
        wrapper.__task__._title = title;
        return wrapper;
      },
      enumerable: true
    });
  }

  /**
   * Initializes a test wrapper.
   *
   * @protected
   * @param wrapper:function  The wrapper function.
   * @param task:Task         The task.
   */
  initTestWrapper(wrapper, task) {
    this.initWrapper(wrapper, task);

    Object.defineProperty(wrapper, "only", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        wrapper(Object.assign({}, opts, {only: true}), ...params);
      },
      enumerable: true
    });

    Object.defineProperty(wrapper, "params", {
      value: (...params) => {
        wrapper.__task__.params = params;
        return wrapper;
      },
      enumerable: true
    });
  }

  /**
   * Ends the report.
   */
  end() {
    this.reporters.end();
    this.loggers.debug(`Ending report.`);
  }

  static get DEFAULT_DISPLAY() {
    return DEFAULT_DISPLAY;
  }

  static get DEFAULT_LOGGER_OPTIONS() {
    return DEFAULT_LOGGER_OPTIONS;
  }
}
