//imports
import Operation from "./Operation";

/**
 * A finalizer.
 */
export default class Finalizer extends Operation {
  /**
   * @override
   */
  get title() {
    if (this.isOfSuite()) return "fin()";
    else if (this.isOfForEach()) return "fin(*)";
    else return `fin(${this.name})`;
  }
}
