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
    var res;

    //(1) build title
    if (this.isOfSuite()) res = "init()";
    else if (this.isOfForEach()) res = "init(*)";
    else res = `init(${this.name})`;

    if (this._title) res += " - " + this._title;

    //(2) return
    return res;
  }
}
