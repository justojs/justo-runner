/**
 * Represents a task.
 *
 * @abstract
 *
 * @readonly namespace:string   The namespace.
 * @readonly ignore:boolean     Must it be ignored? true, yep; false, nope. It can be overloaded by the calls.
 * @readonly title:string       The default title, when a call doesn't specify it explicitly.
 * @readonly mute:boolean       Must it be executed in mute mode? true, yep; false, nope. It can be overloaded by the calls.
 */
export default class Task {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) name
   *
   * @overload
   * @param opts:object The options: name, namespace, ns, desc, description, ignore, title.
   */
  constructor(opts) {
    //(1) arguments
    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) throw new Error("Expected task name.");

    //(2) init
    Object.defineProperty(this, "name", {value: opts.name, enumerable: true});
    Object.defineProperty(this, "namespace", {value: opts.namespace || opts.ns, enumerable: true});
    Object.defineProperty(this, "description", {value: opts.description || opts.desc, enumerable: true});
    Object.defineProperty(this, "title", {value: opts.title || this.name, enumerable: true});
    Object.defineProperty(this, "ignore", {value: opts.hasOwnProperty("ignore") ? !!opts.ignore : false, enumerable: true});
    Object.defineProperty(this, "mute", {value: opts.hasOwnProperty("mute") ? !!opts.mute : false, enumerable: true});
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
   * @alias description
   */
  get desc() {
    return this.description;
  }

  /**
   * The item is synchronous.
   *
   * @type boolean
   * @abstract
   */
  get synchronous() {
    throw new Error("Abstract property.");
  }

  /**
   * @alias synchronous
   */
  get sync() {
    return this.synchronous;
  }

  /**
   * The item is asynchronous.
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
