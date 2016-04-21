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
    var res;

    //(1) build title
    if (this.isOfSuite()) res = "fin()";
    else if (this.isOfForEach()) res = "fin(*)";
    else res= `fin(${this.name})`;

    if (this._title) res += " - " + this._title;

    //(2) return
    return res;
  }
}
