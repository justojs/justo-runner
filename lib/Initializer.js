//imports
import Operation from "./Operation";

/**
 * An initializer.
 */
export default class Initializer extends Operation {
  /**
   * @override
   */
  get title() {
    if (this.isOfSuite()) return "init()";
    else if (this.isOfForEach()) return "init(*)";
    else return `init(${this.name})`;
  }
}
