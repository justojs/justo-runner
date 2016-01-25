//imports
import CompositeTask from "./CompositeTask";
import Initializer from "./Initializer";
import Finalizer from "./Finalizer";

/**
 * A suite of tests.
 */
export default class Suite extends CompositeTask {
  /**
   * Constructor.
   *
   * @param opts:object The suite options.
   */
  constructor(opts) {
    super(opts);

    Object.defineProperty(this, "initializers", {value: [], enumerable: true});
    Object.defineProperty(this, "finalizers", {value: [], enumerable: true});
    Object.defineProperty(this, "_forEachInitializers", {value: []});
    Object.defineProperty(this, "_forEachFinalizers", {value: []});
    Object.defineProperty(this, "testInitializers", {value: [], enumerable: true});
    Object.defineProperty(this, "testFinalizers", {value: [], enumerable: true});
    Object.defineProperty(this, "tasks", {value: [], enumerable: true});
    Object.defineProperty(this, "_parent", {value: undefined, writable: true});
    Object.defineProperty(this, "_only", {value: !!opts.only});
  }

  /**
   * The parent suite.
   *
   * @type Suite
   */
  get parent() {
    return this._parent;
  }

  hasParent() {
    return !!this._parent;
  }

  /**
   * Has this been fixed as only?
   * A suite is fixed as only when it is set as only explicitly or
   * somechild is set as only.
   *
   * @type boolean
   */
  get only() {
    var res;

    //(1) check
    if (this._only) {
      res = true;
    } else {
      res = false;

      for (let child of this.tasks) {
        if (child.__task__.only) {
          res = true;
          break;
        }
      }
    }

    //(2) return
    return res;
  }

  /**
   * Has this been fixed as fully only?
   * A suite is fixed as fully only when it is set as only explicitly and
   * nochild is set as only.
   *
   * @type boolean
   */
  get fullyOnly() {
    var onlys;

    //(1) check
    onlys = 0;

    for (let child of this.tasks) {
      onlys += (child.__task__.only ? 1 : 0);
    }

    //(2) return
    return onlys === 0;
  }

  /**
   * Suite fixed as only?
   *
   * @type boolean
   */
  get hasOnly() {

  }

  /**
   * Adds a task.
   *
   * @param wrapper:function  The wrapper to add.
   */
  add(wrapper) {
    var task = wrapper.__task__;

    if (task instanceof Initializer) {
      if (task.isOfSuite()) this.initializers.push(wrapper);
      else if (task.isOfForEach()) this._forEachInitializers.push(wrapper);
      else this.testInitializers.push(wrapper);
    } else if (task instanceof Finalizer) {
      if (task.isOfSuite()) this.finalizers.push(wrapper);
      else if (task.isOfForEach()) this._forEachFinalizers.push(wrapper);
      else this.testFinalizers.push(wrapper);
    } else {
      this.tasks.push(wrapper);
      task._parent = this;
    }
  }

  /**
   * The for each initializers.
   *
   * @type Initializer[]
   */
  get forEachInitializers() {
    return (this.parent ? this.parent.forEachInitializers : []).concat(
      this._forEachInitializers
    );
  }

  /**
   * The for each finalizers.
   *
   * @type Finalizer[]
   */
  get forEachFinalizers() {
    return (this.parent ? this.parent.forEachFinalizers : []).concat(
      this._forEachFinalizers
    );
  }

  /**
   * Returns the specific initializers a task must run.
   *
   * @param name:string The task name.
   * @return Initializer[]
   */
  getSpecificInitializersOf(name) {
    var inits;

    //(1) get initializers
    inits = [];

    for (let init of this.testInitializers) {
      if (init.__task__.name == name) inits.push(init);
    }

    //(2) return
    return inits;
  }

  /**
   * Returns the specific finalizers a task must run.
   *
   * @param name:string The task name.
   * @param Finalizer[]
   */
  getSpecificFinalizersOf(name) {
    var fins;

    //(1) get finalizers
    fins = [];

    for (let fin of this.testFinalizers) {
      if (fin.__task__.name == name) fins.push(fin);
    }

    //(2) return
    return fins;
  }
}
