//imports
import Item from "./Item";

/**
 * Represents a task.
 *
 * @abstract
 *
 * @readonly namespace:string   The namespace.
 */
export default class Task extends Item {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) name
   *
   * @overload
   * @param opts:object The options: name, namespace, ns, description.
   */
  constructor(opts) {
    //(1) superconstructor
    super(opts);

    //(2) this
    Object.defineProperty(this, "namespace", {value: opts.namespace || opts.ns, enumerable: true});
  }

  /**
   * @alias namespace
   */
  get ns() {
    return this.namespace;
  }

  /**
   * The full qualified name.
   *
   * @type string
   */
  get fullQualifiedName() {
    return (this.namespace ? this.namespace + "." : "") + this.name;
  }

  /**
   * @alias fullQualifiedName
   */
  get fqn() {
    return this.fullQualifiedName;
  }

  /**
   * Returns if the task is simple.
   *
   * @abstract
   * @return boolean
   */
  isSimple() {
    throw new Error("Abstract method.");
  }

  /**
   * Returns if the task is composite.
   *
   * @abstract
   * @return boolean
   */
  isComposite() {
    throw new Error("Abstract method.");
  }

  /**
   * Returns if the task is a macro.
   *
   * @abstract
   * @return boolean
   */
  isMacro() {
    throw new Error("Abstract method.");
  }

  /**
   * Returns if the task is a workflow.
   *
   * @abstract
   * @return boolean
   */
  isWorkflow() {
    throw new Error("Abstract method.");
  }
}
