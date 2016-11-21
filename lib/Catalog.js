//imports
import * as fs from "justo-fs";

//private members
const catalog = Symbol();
const catalogWorkflow = Symbol();
const catalogMacro = Symbol();
const catalogSimple = Symbol();

/**
 * A collection of works.
 *
 * @readonly runner:Runner  The runner associated to the catalog.
 */
export default class Catalog {
  /**
   * Constructor.
   *
   * @param(attr) runner
   */
  constructor(runner) {
    Object.defineProperty(this, "tasks", {enumerable: true, value: {}});
    Object.defineProperty(this, "runner", {enumerable: true, value: runner});
    Object.defineProperty(this, "catalog", {enumerable: true, value: this[catalog].bind(this)});
    Object.defineProperty(this.catalog, "workflow", {enumerable: true, value: this[catalogWorkflow].bind(this)});
    Object.defineProperty(this.catalog, "macro", {enumerable: true, value: this[catalogMacro].bind(this)});
    Object.defineProperty(this.catalog, "simple", {enumerable: true, value: this[catalogSimple].bind(this)});
  }

  /**
   * Add a task.
   *
   * @param wrapper:function  The wrapper function.
   */
  add(wrapper) {
    this.tasks[wrapper.__task__.fqn] = wrapper;
  }

  /**
   * Return task.
   *
   * @param fqn:string  The task FQN.
   * @return function
   */
  get(fqn) {
    return this.tasks[fqn];
  }

  /**
   * Check whether a task exists.
   *
   * @param fqn:string  The task FQN to check.
   * @return boolean
   */
  exists(fqn) {
    return !!this.tasks[fqn];
  }

  /**
   * Register a work.
   *
   * @overload A workflow.
   * @param name:string The work name.
   * @param fn:function The function.
   *
   * @overload A workflow.
   * @param opts:object The work options.
   * @param fn:function The function.
   *
   * @overload A task macro.
   * @param name:string     The work name.
   * @param works:string[]  The work names.
   *
   * @overload A task macro.
   * @param opts:object     The work options.
   * @param works:string[]  The work names.
   *
   * @overload A macro.
   * @param name:string     The work name.
   * @param test:object     The test work options.
   *
   * @overload A test work.
   * @param opts:object     The work options.
   * @param test:object     The test work options.
   */
  [catalog](...args) {
    var opts, task;

    //(1) arguments
    if (args.length < 2) {
      throw new Error("Invalid number of arguments. At least, expected two: name or options and function or object[].");
    } else if (args.length >= 2) {
      [opts, task] = args;
    }

    //(2) register
    if (task instanceof Function) this[catalogWorkflow](opts, task);
    else if (task instanceof Array || task instanceof Object) this[catalogMacro](opts, task);
    else throw new Error("Invalid task to catalog.");
  }

  /**
   * Register a workflow.
   *
   * @overload
   * @param name:string The workflow name.
   * @param fn:Object   The workflow function.
   * @return function
   *
   * @overload
   * @param opts:object The workflow options.
   * @param fn:object   The workflow function.
   * @return function
   */
  [catalogWorkflow](opts, fn) {
    const task = this.runner.workflow(opts, fn);
    this.add(task);
    return task;
  }

  /**
   * Register a macro.
   *
   * @overload
   * @param name:strings    The macro name.
   * @param tasks:object[]  The tasks.
   *
   * @overload
   * @param opts:object     The macro options.
   * @param tasks:object[]  The tasks.
   */
  [catalogMacro](opts, tasks) {
    const task = this.runner.macro(opts, tasks);
    this.add(task);
    return task;
  }

  /**
   * Register a simple task.
   *
   * @overload
   * @param name:string The task name.
   * @param fn:Function The function.
   *
   * @overload
   * @param opts:object The simple task options.
   * @param fn:function The function.
   */
  [catalogSimple](opts, fn) {
    const task = this.runner.simple(opts, fn);
    this.add(task);
    return task;
  }
}
