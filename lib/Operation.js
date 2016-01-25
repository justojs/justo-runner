//imports
import SimpleTask from "./SimpleTask";

/**
 * Common ase for the initializers and finalizers.
 *
 * @readonly parent:Suite The parent.
 */
export default class Operation extends SimpleTask {
  /**
   * Constructor.
   *
   * @param opts:object The init options.
   * @param(attr) fn
   */
  constructor(opts, fn) {
    super(opts, fn);
  }

  /**
   * The operation title.
   *
   * @abstract
   * @type string
   */
  get title() {
    throw new Error("Abstract property");
  }

  /**
   * Check whether the operation is of suite.
   *
   * @return boolean
   */
  isOfSuite() {
    return this.name == Operation.SUITE;
  }

  /**
   * Check whether the operation is a for-each operation.
   *
   * @return boolean
   */
  isOfForEach() {
    return this.name == Operation.FOR_EACH;
  }

  /**
   * Check whether the operation is of a specific test.
   *
   * @return boolean
   */
  isOfSpecificTest() {
    return !(this.isOfSuite() || this.isOfForEach());
  }

  static get SUITE() {
    return "__suite__";
  }

  static get FOR_EACH() {
    return "*";
  }
}
