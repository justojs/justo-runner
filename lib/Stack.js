/**
 * A stack.
 */
export default class Stack extends Array {
  /**
   * The top item.
   *
   * @type object
   */
  get top() {
    return (this.length > 0 ? this[this.length-1] : undefined);
  }

  /**
   * Clear the stack.
   */
  clear() {
    while (this.length > 0) this.pop();
  }
}
