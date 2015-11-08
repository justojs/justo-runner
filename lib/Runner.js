//imports
import {inject} from "justo-injector";
import {SimpleTask, Macro} from "justo-task";

//private member symbols
const task = Symbol();
const macro = Symbol();
const runSimpleTask = Symbol();
const runMacro = Symbol();

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
    Object.defineProperty(this, "task", {value: this[task].bind(this), enumerable: true});
    Object.defineProperty(this, "macro", {value: this[macro].bind(this), enumerable: true});
  }

  /**
   * Wraps a simple task.
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
   *
   * @overload
   * @param name:string
   * @param opts:object
   * @param fn:function
   * @return function
   *
   * @overload
   * @param ns:string
   * @param name:string
   * @param fn:function
   * @return function
   *
   * @overload
   * @param ns:string
   * @param name:string
   * @param opts:object
   * @param fn:function
   * @return function
   */
  [task](...args) {
    var ns, name, opts, fn, tsk, wrapper;

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, the task function must be passed.");
    } else if (args.length == 1) {
      fn = args[0];
    } else  if (args.length == 2) {
      if (typeof(args[0]) == "string") [name, fn] = args;
      else [opts, fn] = args;
    } else if (args.length == 3) {
      if (typeof(args[1]) == "object") [name, opts, fn] = args;
      else [ns, name, fn] = args;
    } else if (args.length >= 4) {
      [ns, name, opts, fn] = args;
    }

    if (!name) name = fn.name;
    if (!opts) opts = {};

    //(2) create task
    tsk = new SimpleTask(ns, name, opts, fn);

    //(3) create function
    wrapper = (opts, ...params) => {
      //(1) arguments
      if (!opts) throw new Error("Invalid number of arguments. At least, the title must be specified.");
      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this[runSimpleTask](tsk, opts, params);
    };

    Object.defineProperty(wrapper, "task", {value: tsk});

    Object.defineProperty(wrapper, "ignore", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        wrapper(Object.assign({}, opts, {ignore: true}), ...params);
      },
      enumerable: true
    });

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
    var title, res, state, err, start, end;

    //(1) init
    title = opts.title || task.fqn;

    //(2) run
    if (opts.ignore) {
      this.reporters.start(title, task);
      this.loggers.debug(`Ignoring simple task '${title}'.`);
      state = "ignored";
    } else {
      try {
        let fn = task.fn;
        params = inject({params: params, logger: this.loggers, log: this.loggers}, fn);
        this.reporters.start(title, task);
        this.loggers.debug(`Starting run of simple task '${title}'.`);
        start = Date.now();
        res = fn(...params);
      } catch (e) {
        err = e;
      } finally {
        end = Date.now();
      }

      state = (err ? "failed" : "ok");
      this.loggers.debug(`Ended run of simple task '${title}' in '${state}' state.`);
    }

    this.reporters.end(task, state, err, start, end);

    //(3) return value returned by the task function
    return res;
  }

  /**
   * Wraps a macro.
   *
   * @overload
   * @param tasks:object[]  Every object can have: task (function, required),
   *                        params (object[], optional) .
   * @return function
   *
   * @overload
   * @param opts:object
   * @param tasks:object[]
   * @return function
   *
   * @overload
   * @param name:string
   * @param tasks:object[]
   * @return function
   *
   * @overload
   * @param name:string
   * @param opts:object
   * @param tasks:object[]
   * @return function
   *
   * @overload
   * @param ns:string
   * @param name:string
   * @param tasks:object[]
   * @return function
   *
   * @overload
   * @param ns:string
   * @param name:string
   * @param opts:object
   * @param tasks:object[]
   * @return function
   */
  [macro](...args) {
    var ns, name, opts, tasks, wrapper, mcr;

    //(1) arguments
    if (args.length === 0) {
      throw new Error("Invalid number of arguments. At least, the array of tasks must be passed.");
    } else if (args.length == 1) {
      tasks = args[0];
    } else if (args.length == 2) {
      if (typeof(args[0]) == "string") [name, tasks] = args;
      else [opts, tasks] = args;
    } else if (args.length == 3) {
      if (typeof(args[1]) == "string") [ns, name, tasks] = args;
      else [name, opts, tasks] = args;
    } else if (args.length >= 4) {
      [ns, name, opts, tasks] = args;
    }

    if (!name) name = "macro";
    if (!opts) opts = {};

    //(2) create macro
    mcr = new Macro(ns, name, opts, tasks);

    //(3) create function
    wrapper = (opts, ...params) => {
      //(1) arguments
      if (!opts) throw new Error("Invalid number of arguments. At least, the title must be specified.");
      if (typeof(opts) == "string") opts = {title: opts};

      //(2) run task
      return this[runMacro](mcr, opts, params);
    };

    Object.defineProperty(wrapper, "macro", {value: mcr});

    Object.defineProperty(wrapper, "ignore", {
      value: (opts, ...params) => {
        if (typeof(opts) == "string") opts = {title: opts};
        wrapper(Object.assign({}, opts, {ignore: true}), ...params);
      },
      enumerable: true
    });

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
    var title, res, state, err, start, end, self;

    //(1) init
    self = this;
    title = opts.title;
    params = (params.length === 0 ? undefined : params);

    //(2) run
    this.reporters.start(title, macro);

    if (opts.ignore) {
      this.loggers.debug(`Ignoring macro '${title}'.`);
      state = "ignored";
    } else {
      this.loggers.debug(`Starting run of macro '${title}'.`);

      try {
        start = Date.now();

        for (let t of macro.tasks) {  //t is object as {task, params}
          let task = t.task;
          let pp = params || t.params || [];

          if (task.task && task.task instanceof SimpleTask) {
            this[runSimpleTask](task.task, opts, pp);
          } else if (task.macro && task.macro instanceof Macro) {
            this[runMacro](task.macro, opts, pp);
          } else {
            task(...pp);
          }
        }
      } catch (e) {
        err = e;
      } finally {
        end = Date.now();
      }

      state = (err ? "failed" : "ok");
      this.loggers.debug(`Ended run of macro '${title}' in '${state}' state.`);
    }

    this.reporters.end(macro, state, err, start, end);
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
