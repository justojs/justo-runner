//imports
import CompositeTask from "./CompositeTask";

/**
 * A macro: array of tasks.
 *
 * @readonly tasks:object[] The tasks. Each task is an object: title (String), task (Task), params (object).
 */
export default class Macro extends CompositeTask {
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
   * @param t:object  The task object: title (string), task (Task) and params (object).
   */
  add(t) {
    //(1) arguments
    if (t instanceof Function) t = {task: t, params: undefined};
    if (!t.task) throw new Error("No task of macro indicated.");
    if (!t.title) {
      if (t.task.__task__) t.title = t.task.__task__.name;
      else t.title = t.task.name || "anonymous";
    }

    //(2) add
    this.tasks.push(t);
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
