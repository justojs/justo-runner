//imports
import Task from "./Task";

/**
 * Base for the composite tasks, for example, macros and workflows.
 *
 * @abstract
 */
export default class CompositeTask extends Task {
  /**
   * @override
   */
  isSimple() {
    return false;
  }
}
