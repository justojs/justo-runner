//imports
import {inject} from "justo-injector";
import {ResultState} from "justo-result";
import SimpleTask from "./SimpleTask";
import Macro from "./Macro";
import Workflow from "./Workflow";

//private member symbols
const simple = Symbol();
const macro = Symbol();
const workflow = Symbol();
const runSimpleTask = Symbol();
const runMacro = Symbol();
const runWorkflow = Symbol();
const defineTask = Symbol();
const defineIgnore = Symbol();
const defineMute = Symbol();

/**
 * A runner.
 *
 * @readonly loggers:loggers      The logger to use.
 * @readonly reporters:Reporters  The reporters to notify.
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

    //(2) init
    Object.defineProperty(this, "loggers", {value: config.loggers, enumerable: true});
    Object.defineProperty(this, "reporters", {value: config.reporters, enumerable: true});
    Object.defineProperty(this, "simple", {value: this[simple].bind(this), enumerable: true});
    Object.defineProperty(this, "macro", {value: this[macro].bind(this), enumerable: true});
    Object.defineProperty(this, "workflow", {value: this[workflow].bind(this), enumerable: true});
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

    //(1) arguments
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
      return this[runSimpleTask](task, opts, params);
    };

    this[defineTask](wrapper, task);
    this[defineIgnore](wrapper);
    this[defineMute](wrapper);

    //(4) return wrapper function
    return wrapper;
  }

  /**
   * Runs a simple task.
   *
   * @param task:SimpleTask The task.
   * @param opts:object     The run options.
   * @param params:object[] The arguments.
   */
  [runSimpleTask](task, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || task.title;
    if (!opts.hasOwnProperty("ignore")) opts.ignore = task.ignore;
    if (!opts.hasOwnProperty("mute")) opts.mute = task.mute;

    //(2) run
    if (opts.ignore) {
      this.loggers.debug(`Ignoring simple task '${title}'.`);
      if (!opts.mute) this.reporters.ignore(title, task);
    } else {
      let state, err, start, end;

      try {
        let fn = task.fn;
        params = inject({params: params, logger: this.loggers, log: this.loggers}, fn);

        this.loggers.debug(`Starting run of simple task '${title}'.`);
        if (!opts.mute) this.reporters.start(title, task);

        start = Date.now();
        res = fn(...params);
        state = ResultState.OK;
      } catch (e) {
        err = e;
        state = ResultState.FAILED;
      } finally {
        end = Date.now();
      }

      this.loggers.debug(`Ended run of simple task '${title}' in '${state}' state.`);
      if (!opts.mute) this.reporters.end(task, state, err, start, end);
    }

    //(3) return value returned by the task function
    return res;
  }

  /**
   * Wraps a macro.
   *
   * @overload
   * @param tasks:object[]
   * @return function

   * @overload
   * @param opts:object
   * @param tasks:object[]
   * @return function
   *
   * @overload
   * @param name:string
   * @param tasks:object[]
   * @return function
   */
  [macro](...args) {
    var opts, tasks, wrapper, task;

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, the array of tasks must be passed.");
    } else if (args.length == 1) {
      tasks = args[0];
      opts = {};
    } else if (args.length >= 2) {
      [opts, tasks] = args;
    }

    if (typeof(opts) == "object" && !opts.name) opts.name = "anonymous macro";

    //(2) create macro
    task = new Macro(opts, []);

    for (let t of tasks) {  //the non-task functions must be converted to simple task
      if (t instanceof Function) {
        if (!t.__task__) t = this[simple](t);
      } else {
        if (!t.task.__task__) t.task = this[simple](t.task);
      }

      task.add(t);
    }

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
      return this[runMacro](task, opts, params);
    };

    this[defineTask](wrapper, task);
    this[defineIgnore](wrapper);
    this[defineMute](wrapper);

    //(4) return wrapper function
    return wrapper;
  }

  /**
   * Runs a macro.
   *
   * @param macro:Macro     The macro.
   * @param opts:object     The run options.
   * @param params:object[] The arguments.
   */
  [runMacro](macro, opts, params) {
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
      this.loggers.debug(`Starting run of macro '${title}'.`);
      if (!opts.mute) this.reporters.start(title, macro);

      for (let t of macro.tasks) {  //t is object as {task, params}
        let task = t.task;
        let __task__ = task.__task__;
        let oo = {title: t.title, mute: opts.mute};
        let pp = params || t.params || [];

        if (__task__ instanceof SimpleTask) this[runSimpleTask](__task__, oo, pp);
        else if (__task__ instanceof Macro) this[runMacro](__task__, oo, pp);
        else if (__task__ instanceof Workflow) this[runWorkflow](__task__, oo, pp);
        else throw new Error("Invalid task of macro.");
      }

      this.loggers.debug(`Ended run of macro '${title}'.`);
      if (!opts.mute) this.reporters.end(macro);
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
      return this[runWorkflow](task, opts, params);
    };

    this[defineTask](wrapper, task);
    this[defineIgnore](wrapper);
    this[defineMute](wrapper);

    //(4) return wrapper function
    return wrapper;
  }

  /**
   * Run a workflow.
   *
   * @private
   * @param workflow:Workflow The workflow to run.
   * @param opts:object       The run options.
   * @param params:object[]   The run arguments.
   */
  [runWorkflow](workflow, opts, params) {
    var title, res;

    //(1) init
    title = opts.title || workflow.fqn;
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
        params = inject({params: params, logger: this.loggers, log: this.loggers}, fn);

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
    }

    //(3) return value returned by the task function
    return res;
  }

  /**
   * Define the __task__ property.
   *
   * @private
   * @param wrapper:function  The wrapper function.
   */
  [defineTask](wrapper, task) {
    Object.defineProperty(wrapper, "__task__", {value: task});
  }

  /**
   * Define the .ignore() member.
   *
   * @private
   * @param wrapper:function  The wrapper function.
   */
  [defineIgnore](wrapper) {
    Object.defineProperty(wrapper, "ignore", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        wrapper(Object.assign({}, opts, {ignore: true}), ...params);
      },
      enumerable: true
    });
  }

  /**
   * Define the .mute() member.
   *
   * @private
   * @param wrapper:function  The wrapper function.
   */
  [defineMute](wrapper) {
    Object.defineProperty(wrapper, "mute", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        return wrapper(Object.assign({}, opts, {mute: true}), ...params);
      },
      enumerable: true
    });
  }

  /**
   * Starts the report.
   *
   * @param title:string
   */
  start(title) {
    this.reporters.start(title);
    this.loggers.debug(`Starting report '${title}'.`);
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
