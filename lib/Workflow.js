//imports
import {hasParameter} from "justo-injector";
import CompositeTask from "./CompositeTask";

/**
 * A workflow.
 *
 * @readonly fn:function  The flow function.
 * @readonly synchronous:boolean    Is it synchronous?
 * @readonly parameterized:boolean  Is it a parameterized task?
 */
export default class Workflow extends CompositeTask {
  /**
   * Constructor.

   * @overload
   * @param(attr) name
   * @param(attr) fn
   *
   * @overload
   * @param opts:object   The options.
   * @param(attr) fn
   */
  constructor(opts, fn) {
    //(1) arguments
    if (!fn) throw new Error("Expected flow function.");

    //(2) superconstructor
    super(opts);

    //(3) this constructor
    Object.defineProperty(this, "fn", {value: fn, enumerable: true});
    Object.defineProperty(this, "synchronous", {value: !hasParameter("done", this.fn), enumerable: true});
    Object.defineProperty(this, "parameterized", {value: hasParameter("params", this.fn), enumerable: true});
  }

  /**
   * @alias synchronous
   */
  get sync() {
    return this.synchronous;
  }

  /**
   * Is it asynchornous?
   *
   * @type boolean
   */
  get asynchronous() {
    return !this.sync;
  }

  /**
   * @alias asynchronous
   */
  get async() {
    return this.asynchronous;
  }
}
