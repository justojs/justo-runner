/**
 * Base for the tasks and operations.
 *
 * @abstract
 *
 * @readonly name:string        The item name.
 * @readonly description:string The item description.
 */
export default class Item {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) name
   *
   * @overload
   * @param opts:object The options: name, description or desc.
   */
  constructor(opts) {
    //(1) arguments
    if (typeof(opts) == "string") opts = {name: opts};
    if (!opts.name) throw new Error("Expected task name.");

    //(2) init
    Object.defineProperty(this, "name", {value: opts.name, enumerable: true});
    Object.defineProperty(this, "description", {value: opts.description || opts.desc, enumerable: true});
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
}
