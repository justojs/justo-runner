/**
 * A stack.
 */
export default class Stack extends Array {
  /**
   * Constructor.
   */
  constructor() {
    super();

    Object.defineProperty(this, "top", {enumerable: true, get: () => {
      return (this.length > 0 ? this[this.length-1] : undefined);
    }});
    
    Object.defineProperty(this, "clear", {enumerable: true, value: () => {
      while (this.length > 0) this.pop();
    }});
  }
}
