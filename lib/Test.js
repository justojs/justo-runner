//imports
import CompositeTask from "./CompositeTask";

/**
 * A test unit.
 *
 * @readonly fn:function      The function. This is a simple task wrapper.
 * @readonly params:object[]  The test parameters.
 * @readonly only:boolean     Only tag.
 */
export default class Test extends CompositeTask {
  /**
   * Constructor.
   *
   * @param opts:object   The test options.
   * @param(attr) fn
   */
  constructor(opts, fn) {
    //(1) super
    super(opts);

    //(2) this
    Object.defineProperty(this, "fn", {value: fn, enumerable: true});
    Object.defineProperty(this, "_parent", {value: undefined, writable: true});
    Object.defineProperty(this, "only", {value: !!opts.only, enumerable: true});
    Object.defineProperty(this, "params", {value: opts.params, writable: true, enumerable: true});
  }

  get parent() {
    return this._parent;
  }

  /**
   * Check whether this has specified params explicitly.
   *
   * @return boolean
   */
  hasParams() {
    return !!this.params;
  }

  /**
   * The initializers.
   *
   * @type Initializert[]
   */
  get initializers() {
    var parent = this._parent;
    return parent.forEachInitializers.concat(parent.getSpecificInitializersOf(this.name));
  }

  /**
   * The finalizers.
   *
   * @type Finalizer[]
   */
  get finalizers() {
    var parent = this._parent;
    return parent.forEachFinalizers.concat(parent.getSpecificFinalizersOf(this.name));
  }
}
