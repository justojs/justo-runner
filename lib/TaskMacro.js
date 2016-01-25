//imports
import CompositeTask from "./CompositeTask";

/**
 * A macro: array of tasks.
 *
 * @readonly tasks:object[] The tasks. Each task is an object: title (String), task (Task), params (object).
 */
export default class TaskMacro extends CompositeTask {
  /**
   * Constructor.
   *
   * @overload Root task.
   * @param(attr) name
   * @param(attr) tasks
   *
   * @overload Root task.
   * @param opts:object The options.
   * @param(attr) tasks
   */
  constructor(opts, tasks) {
    //(1) super
    super(opts);

    //(2) this constructor
    Object.defineProperty(this, "tasks", {value: [], enumerable: true});
    for (let task of tasks) this.add(task);
  }

  /**
   * Number of tasks.
   *
   * @type number
   */
  get length() {
    return this.tasks.length;
  }

  /**
   * Adds a task.
   *
   * @param task:object The task object: title (string), task (Task) and params (object).
   */
  add(task) {
    this.tasks.push(task);
  }

  /**
   * @override
   */
  get synchronous() {
    var res;

    //(1) check
    res = true;

    for (let i = 0, tasks = this.tasks; res && i < tasks.length; ++i) {
      if (tasks[i].async) res = false;
    }

    //(2) return
    return res;
  }
}
